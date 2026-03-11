import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { createCheckoutSession, type PlanType } from "@/lib/stripe";

const VALID_PLANS: PlanType[] = ["monthly", "yearly", "lifetime"];

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json();
  const { plan } = body;

  if (!plan || !VALID_PLANS.includes(plan)) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  try {
    const checkoutSession = await createCheckoutSession(session.userId, plan);
    return NextResponse.json({ url: checkoutSession.url });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
