import Stripe from "stripe";
import { prisma } from "./db";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-02-25.clover",
  });
}

export type PlanType = "monthly" | "yearly" | "lifetime";

const PLAN_CONFIG: Record<
  PlanType,
  { envKey: string; mode: Stripe.Checkout.SessionCreateParams["mode"] }
> = {
  monthly: { envKey: "STRIPE_PRICE_MONTHLY", mode: "subscription" },
  yearly: { envKey: "STRIPE_PRICE_YEARLY", mode: "subscription" },
  lifetime: { envKey: "STRIPE_PRICE_LIFETIME", mode: "payment" },
};

export async function createCheckoutSession(userId: string, plan: PlanType) {
  const stripe = getStripe();
  const config = PLAN_CONFIG[plan];
  const priceId = process.env[config.envKey];

  if (!priceId) {
    throw new Error(`Missing price ID for plan: ${plan}`);
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");

  let customerId = user.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email || undefined,
      metadata: { userId: user.id, xUsername: user.xUsername },
    });
    customerId = customer.id;
    await prisma.user.update({
      where: { id: userId },
      data: { stripeCustomerId: customerId },
    });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: config.mode,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}/dashboard?payment=success`,
    cancel_url: `${appUrl}/pricing`,
    client_reference_id: userId,
    metadata: { userId, plan },
  });

  return session;
}

export { getStripe };
