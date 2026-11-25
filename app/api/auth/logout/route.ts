import { NextRequest, NextResponse } from "next/server";
import {
  getAuthSecret,
  revokeSessionToken,
  SESSION_COOKIE_NAME,
} from "@/lib/auth";

export async function POST(req: NextRequest) {
  const secret = getAuthSecret();
  const sessionCookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (secret && sessionCookie) {
    await revokeSessionToken(sessionCookie, secret);
  }

  const forwardedProto = req.headers
    .get("x-forwarded-proto")
    ?.split(",")[0]
    ?.trim()
    .toLowerCase();
  const isHttps =
    req.nextUrl.protocol === "https:" || forwardedProto === "https";

  const response = NextResponse.json(
    { success: true },
    { headers: { "Cache-Control": "no-store" } }
  );
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: isHttps,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
