import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { refreshAccessToken } from "@/lib/x-auth";
import { fetchBookmarks } from "@/lib/x-api";
import { sendDigestEmail } from "@/lib/email";

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
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
        if (
          lastDigest.toDateString() === now.toDateString()
        ) {
          results.push({ userId: user.id, status: "skipped_already_sent" });
          continue;
        }
      }

      // Refresh token if expired
      let accessToken = user.accessToken;
      if (new Date(user.tokenExpiresAt) <= now) {
        try {
          const tokens = await refreshAccessToken(user.refreshToken);
          accessToken = tokens.accessToken;

          await prisma.user.update({
            where: { id: user.id },
            data: {
              accessToken: tokens.accessToken,
              refreshToken: tokens.refreshToken,
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
