import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      xUsername: true,
      xDisplayName: true,
      email: true,
      bookmarkCount: true,
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

  const body = await request.json();
  const { email, bookmarkCount, isActive } = body;

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
    if (typeof email !== "string" || !emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
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
    },
    select: {
      email: true,
      bookmarkCount: true,
      isActive: true,
    },
  });

  return NextResponse.json(user);
}
