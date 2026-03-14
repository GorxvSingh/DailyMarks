import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { createCheckoutSession, type PlanType } from "@/lib/stripe";
import { rateLimit, getClientIP, rateLimitHeaders } from "@/lib/rate-limit";

const VALID_PLANS: PlanType[] = ["monthly", "yearly", "lifetime"];

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Rate limit: 5 checkout attempts per minute
  const ip = getClientIP(request);
  const rl = rateLimit(`checkout:${ip}`, { limit: 5, windowSeconds: 60 });
  if (!rl.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: rateLimitHeaders(rl) }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { plan } = body;

  if (!plan || !VALID_PLANS.includes(plan)) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  try {
    const checkoutSession = await createCheckoutSession(session.userId, plan);
    return NextResponse.json({ url: checkoutSession.url });
  } catch (err) {
    console.error("Checkout error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: `Checkout failed: ${message}` },
      { status: 500 }
    );
  }
}
