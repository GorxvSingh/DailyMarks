import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/db";
import { rateLimit, getClientIP, rateLimitHeaders } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate limit: 30 reads per minute
  const ip = getClientIP(request);
  const rl = rateLimit(`prefs-get:${ip}`, { limit: 30, windowSeconds: 60 });
  if (!rl.success) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: rateLimitHeaders(rl) }
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      xUsername: true,
      xDisplayName: true,
      email: true,
      bookmarkCount: true,
      digestTime: true,
      timezone: true,
      isActive: true,
      lastDigestAt: true,
      plan: true,
      planExpiresAt: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PUT(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate limit: 10 updates per minute
  const ip = getClientIP(request);
  const rl = rateLimit(`prefs-put:${ip}`, { limit: 10, windowSeconds: 60 });
  if (!rl.success) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: rateLimitHeaders(rl) }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { email, bookmarkCount, isActive, digestTime, timezone } = body;

  // Validate bookmark count
  if (
    bookmarkCount !== undefined &&
    (typeof bookmarkCount !== "number" || bookmarkCount < 1 || bookmarkCount > 20)
  ) {
    return NextResponse.json(
      { error: "bookmarkCount must be between 1 and 20" },
      { status: 400 }
    );
  }

  // Validate email format if provided
  if (email !== undefined && email !== null) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (
      typeof email !== "string" ||
      email.length > 254 ||
      !emailRegex.test(email)
    ) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }
  }

  // Validate digestTime format (HH:MM)
  if (digestTime !== undefined) {
    if (typeof digestTime !== "string" || !/^([01]\d|2[0-3]):([0-5]\d)$/.test(digestTime)) {
      return NextResponse.json(
        { error: "digestTime must be in HH:MM format (e.g., 08:00)" },
        { status: 400 }
      );
    }
  }

  // Validate timezone if provided
  if (timezone !== undefined) {
    if (typeof timezone !== "string" || timezone.length > 100) {
      return NextResponse.json(
        { error: "Invalid timezone" },
        { status: 400 }
      );
    }
  }

  const user = await prisma.user.update({
    where: { id: session.userId },
    data: {
      ...(email !== undefined && { email }),
      ...(bookmarkCount !== undefined && { bookmarkCount }),
      ...(isActive !== undefined && { isActive: Boolean(isActive) }),
      ...(digestTime !== undefined && { digestTime }),
      ...(timezone !== undefined && { timezone }),
    },
    select: {
      email: true,
      bookmarkCount: true,
      digestTime: true,
      timezone: true,
      isActive: true,
    },
  });

  return NextResponse.json(user);
}
