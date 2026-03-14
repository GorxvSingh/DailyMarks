import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { rateLimit, getClientIP, rateLimitHeaders } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const ip = getClientIP(request);
  const rl = rateLimit(`waitlist:${ip}`, { limit: 3, windowSeconds: 900 });

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

  const { email } = body;

  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  try {
    await prisma.waitlist.create({
      data: { email: email.toLowerCase().trim() },
    });
  } catch (err: unknown) {
    if (
      err &&
      typeof err === "object" &&
      "code" in err &&
      (err as { code: string }).code === "P2002"
    ) {
      return NextResponse.json(
        { error: "You're already on the waitlist!" },
        { status: 409, headers: rateLimitHeaders(rl) }
      );
    }
    console.error("Waitlist signup error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { success: true },
    { headers: rateLimitHeaders(rl) }
  );
}
