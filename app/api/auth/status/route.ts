import { NextRequest, NextResponse } from "next/server";
import {
  getAuthSecret,
  isAuthRequired,
  isValidSession,
  SESSION_COOKIE_NAME,
} from "@/lib/auth";

export async function GET(req: NextRequest) {
  const authRequired = isAuthRequired();
  if (!authRequired) {
    return NextResponse.json({
      authRequired: false,
      authenticated: true,
    });
  }

  const secret = getAuthSecret()!;
  const sessionCookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.substring(7)
    : req.headers.get("x-api-key") || req.nextUrl.searchParams.get("token");

  const isAuthenticated =
    (await isValidSession(sessionCookie, secret)) ||
    (await isValidSession(token, secret));

  return NextResponse.json({
    authRequired: true,
    authenticated: isAuthenticated,
  });
}
