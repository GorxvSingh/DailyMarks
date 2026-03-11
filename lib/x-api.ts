import { prisma } from "./db";

export interface Bookmark {
  tweetId: string;
  text: string;
  createdAt: string;
  authorName: string;
  authorUsername: string;
  authorProfileImageUrl?: string;
  url: string;
}

export async function fetchBookmarks(
  userId: string,
  xId: string,
  accessToken: string,
  count: number
): Promise<Bookmark[]> {
  // Fetch more than needed so we can filter out already-sent ones
  const maxResults = Math.min(count * 3, 100);

  const url = new URL(`https://api.x.com/2/users/${xId}/bookmarks`);
  url.searchParams.set("max_results", String(maxResults));
  url.searchParams.set("tweet.fields", "created_at,author_id,text,entities");
  url.searchParams.set("expansions", "author_id");
  url.searchParams.set("user.fields", "name,username,profile_image_url");

  const response = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to fetch bookmarks: ${error}`);
  }

  const json = await response.json();

  if (!json.data || json.data.length === 0) {
    return [];
  }

  // Build author lookup from includes
  const authors: Record<
    string,
    { name: string; username: string; profile_image_url?: string }
  > = {};
  if (json.includes?.users) {
    for (const user of json.includes.users) {
      authors[user.id] = {
        name: user.name,
        username: user.username,
        profile_image_url: user.profile_image_url,
      };
    }
  }

  // Get already-sent bookmark IDs for this user
  const sentIds = new Set(
    (
      await prisma.sentBookmark.findMany({
        where: { userId },
        select: { tweetId: true },
      })
    ).map((s) => s.tweetId)
  );

  // Map and filter
  const bookmarks: Bookmark[] = [];
  for (const tweet of json.data) {
    if (sentIds.has(tweet.id)) continue;
    if (bookmarks.length >= count) break;

    const author = authors[tweet.author_id] || {
      name: "Unknown",
      username: "unknown",
    };

    bookmarks.push({
      tweetId: tweet.id,
      text: tweet.text,
      createdAt: tweet.created_at,
      authorName: author.name,
      authorUsername: author.username,
      authorProfileImageUrl: author.profile_image_url,
      url: `https://x.com/${author.username}/status/${tweet.id}`,
    });
  }

  return bookmarks;
}
