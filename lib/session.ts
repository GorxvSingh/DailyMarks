import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const SESSION_COOKIE = "dm_session";
const secret = () =>
  new TextEncoder().encode(process.env.SESSION_SECRET || "dev-secret-change-me");

export async function createSession(userId: string) {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("30d")
    .setIssuedAt()
    .sign(secret());

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
}

export async function getSession(
  request?: NextRequest
): Promise<{ userId: string } | null> {
  try {
    let token: string | undefined;

    if (request) {
      token = request.cookies.get(SESSION_COOKIE)?.value;
    } else {
      const cookieStore = await cookies();
      token = cookieStore.get(SESSION_COOKIE)?.value;
    }

    if (!token) return null;

    const { payload } = await jwtVerify(token, secret());
    return { userId: payload.userId as string };
  } catch {
    return null;
  }
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
