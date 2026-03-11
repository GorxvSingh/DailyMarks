import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";
import type Stripe from "stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const stripe = getStripe();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId || session.client_reference_id;
      const plan = session.metadata?.plan;

      if (!userId || !plan) break;

      let planExpiresAt: Date | null = null;
      if (plan === "monthly") {
        planExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      } else if (plan === "yearly") {
        planExpiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
      }

      await prisma.user.update({
        where: { id: userId },
        data: { plan, planExpiresAt },
      });
      break;
    }

    case "invoice.paid": {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId =
        typeof invoice.customer === "string"
          ? invoice.customer
          : invoice.customer?.id;

      if (!customerId) break;

      const user = await prisma.user.findFirst({
        where: { stripeCustomerId: customerId },
      });
      if (!user) break;

      let planExpiresAt: Date | null = null;
      if (user.plan === "monthly") {
        planExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      } else if (user.plan === "yearly") {
        planExpiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
      }

      await prisma.user.update({
        where: { id: user.id },
        data: { planExpiresAt },
      });
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId =
        typeof subscription.customer === "string"
          ? subscription.customer
          : subscription.customer.id;

      const user = await prisma.user.findFirst({
        where: { stripeCustomerId: customerId },
      });
      if (!user) break;

      await prisma.user.update({
        where: { id: user.id },
        data: { plan: "free", planExpiresAt: null },
      });
      break;
    }
  }

  return NextResponse.json({ received: true });
}
