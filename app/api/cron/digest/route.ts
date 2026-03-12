import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { prisma } from "@/lib/db";
import { refreshAccessToken } from "@/lib/x-auth";
import { fetchBookmarks } from "@/lib/x-api";
import { sendDigestEmail } from "@/lib/email";
import { rateLimit, getClientIP, rateLimitHeaders } from "@/lib/rate-limit";
import { decrypt } from "@/lib/crypto";

function safeCompare(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a, "utf8");
    const bufB = Buffer.from(b, "utf8");
    if (bufA.length !== bufB.length) return false;
    return timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  // Rate limit: 2 requests per minute (cron shouldn't fire more often)
  const ip = getClientIP(request);
  const rl = rateLimit(`cron:${ip}`, { limit: 2, windowSeconds: 60 });
  if (!rl.success) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: rateLimitHeaders(rl) }
    );
  }

  // Verify cron secret with timing-safe comparison
  const authHeader = request.headers.get("authorization") || "";
  const expected = `Bearer ${process.env.CRON_SECRET || ""}`;
  if (!process.env.CRON_SECRET || !safeCompare(authHeader, expected)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await prisma.user.findMany({
    where: {
      isActive: true,
      email: { not: null },
    },
  });

  const results: { userId: string; status: string; error?: string }[] = [];
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  for (const user of users) {
    try {
      // Skip if digest was already sent today
      if (user.lastDigestAt) {
        const lastDigest = new Date(user.lastDigestAt);
        if (lastDigest.toDateString() === now.toDateString()) {
          results.push({ userId: user.id, status: "skipped_already_sent" });
          continue;
        }
      }

      // Decrypt tokens
      let accessToken: string;
      let refreshToken: string;
      try {
        accessToken = decrypt(user.accessToken);
        refreshToken = decrypt(user.refreshToken);
      } catch {
        // Tokens may be stored in plaintext (pre-encryption migration)
        accessToken = user.accessToken;
        refreshToken = user.refreshToken;
      }

      // Refresh token if expired
      if (new Date(user.tokenExpiresAt) <= now) {
        try {
          const tokens = await refreshAccessToken(refreshToken);
          accessToken = tokens.accessToken;

          // Import encrypt dynamically to avoid circular deps
          const { encrypt } = await import("@/lib/crypto");
          await prisma.user.update({
            where: { id: user.id },
            data: {
              accessToken: encrypt(tokens.accessToken),
              refreshToken: encrypt(tokens.refreshToken),
              tokenExpiresAt: new Date(
                Date.now() + tokens.expiresIn * 1000
              ),
            },
          });
        } catch {
          // Token refresh failed - deactivate user
          await prisma.user.update({
            where: { id: user.id },
            data: { isActive: false },
          });
          results.push({
            userId: user.id,
            status: "error",
            error: "Token refresh failed - user deactivated",
          });
          continue;
        }
      }

      // Fetch bookmarks
      const bookmarks = await fetchBookmarks(
        user.id,
        user.xId,
        accessToken,
        user.bookmarkCount
      );

      if (bookmarks.length === 0) {
        results.push({ userId: user.id, status: "skipped_no_new_bookmarks" });
        continue;
      }

      // Send email
      await sendDigestEmail(user.email!, bookmarks, dateStr);

      // Record sent bookmarks
      for (const b of bookmarks) {
        await prisma.sentBookmark.upsert({
          where: {
            userId_tweetId: { userId: user.id, tweetId: b.tweetId },
          },
          update: {},
          create: { userId: user.id, tweetId: b.tweetId },
        });
      }

      // Update last digest time
      await prisma.user.update({
        where: { id: user.id },
        data: { lastDigestAt: now },
      });

      results.push({
        userId: user.id,
        status: "sent",
      });
    } catch (err) {
      results.push({
        userId: user.id,
        status: "error",
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }

    // Rate limit: small delay between users
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  return NextResponse.json({
    processed: users.length,
    results,
  });
}
