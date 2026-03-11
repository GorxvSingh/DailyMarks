import { NextResponse } from "next/server";
import { clearSession } from "@/lib/session";

export async function GET() {
  await clearSession();
  return NextResponse.redirect(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  );
}
