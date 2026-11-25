import { NextRequest, NextResponse } from "next/server";
import {
  getAuthSecret,
  isAuthRequired,
  isValidApiCredential,
  isValidSession,
  SESSION_COOKIE_NAME,
} from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export async function GET(req: NextRequest) {
  const clientIp = getClientIp(req);
  const ipLimit = checkRateLimit(`auth-status:${clientIp}`, 30, 60 * 1000);
  const globalLimit = checkRateLimit("auth-status:__global__", 120, 60 * 1000);
  if (!ipLimit.allowed || !globalLimit.allowed) {
    const retryAfter = Math.max(ipLimit.resetSeconds, globalLimit.resetSeconds, 1);
    return NextResponse.json(
      { error: "Too many status requests" },
      {
        status: 429,
        headers: {
          "Retry-After": retryAfter.toString(),
          "Cache-Control": "no-store",
        },
      }
    );
  }

  const authRequired = isAuthRequired();
  if (!authRequired) {
    return NextResponse.json(
      { authRequired: false, authenticated: true },
      { headers: { "Cache-Control": "no-store" } }
    );
  }

  const secret = getAuthSecret()!;
  const sessionCookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const authHeader = req.headers.get("authorization");
  const headerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.substring(7)
    : req.headers.get("x-api-key");

  const isAuthenticated =
    (await isValidSession(sessionCookie, secret)) ||
    (await isValidApiCredential(headerToken, secret));

  return NextResponse.json(
    { authRequired: true, authenticated: isAuthenticated },
    { headers: { "Cache-Control": "no-store" } }
  );
}
