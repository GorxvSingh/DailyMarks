import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { rateLimit, getClientIP, rateLimitHeaders } from "@/lib/rate-limit";

const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;
const MAX_MESSAGE_LENGTH = 2000;

export async function POST(request: NextRequest) {
  // Rate limit: 3 submissions per 15 minutes per IP
  const ip = getClientIP(request);
  const rl = rateLimit(`contact:${ip}`, { limit: 3, windowSeconds: 900 });

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

  const { name, email, message } = body;

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 }
    );
  }

  // Validate types
  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof message !== "string"
  ) {
    return NextResponse.json(
      { error: "Invalid field types" },
      { status: 400 }
    );
  }

  // Validate lengths
  if (name.trim().length === 0 || name.length > MAX_NAME_LENGTH) {
    return NextResponse.json(
      { error: `Name must be between 1 and ${MAX_NAME_LENGTH} characters` },
      { status: 400 }
    );
  }

  if (email.length > MAX_EMAIL_LENGTH) {
    return NextResponse.json(
      { error: "Invalid email address" },
      { status: 400 }
    );
  }

  if (message.trim().length === 0 || message.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json(
      { error: `Message must be between 1 and ${MAX_MESSAGE_LENGTH} characters` },
      { status: 400 }
    );
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json(
      { error: "Invalid email address" },
      { status: 400 }
    );
  }

  // Send email via Resend
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "DailyMarks <support@dailymarks.online>",
      to: "support@dailymarks.online",
      replyTo: email,
      subject: `Contact Form: ${name.slice(0, 50)}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    });
  } catch (err) {
    console.error("Failed to send contact email:", err);
    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { success: true },
    { headers: rateLimitHeaders(rl) }
  );
}
