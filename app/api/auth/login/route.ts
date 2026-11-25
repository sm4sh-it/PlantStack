import { NextRequest, NextResponse } from "next/server";
import {
  getAuthSecret,
  createSessionToken,
  constantTimeEqual,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE,
} from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  try {
    const secret = getAuthSecret();
    if (!secret) {
      return NextResponse.json(
        { success: true, message: "No authentication configured (LAN mode)" },
        { headers: { "Cache-Control": "no-store" } }
      );
    }

    const clientIp = getClientIp(req);
    const ipLimit = checkRateLimit(`auth-login:${clientIp}`, 10, 60 * 1000);
    const globalLimit = checkRateLimit("auth-login:__global__", 60, 60 * 1000);
    if (!ipLimit.allowed || !globalLimit.allowed) {
      const retryAfter = Math.max(ipLimit.resetSeconds, globalLimit.resetSeconds, 1);
      return NextResponse.json(
        { error: "Too many login attempts. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": retryAfter.toString(),
            "Cache-Control": "no-store",
          },
        }
      );
    }

    const body = await req.json().catch(() => null);
    const password =
      body && typeof body.password === "string" ? body.password.trim() : "";

    if (!password || !(await constantTimeEqual(password, secret))) {
      return NextResponse.json(
        { error: "Invalid password or API secret" },
        { status: 401, headers: { "Cache-Control": "no-store" } }
      );
    }

    const token = await createSessionToken(secret);
    const response = NextResponse.json(
      { success: true },
      { headers: { "Cache-Control": "no-store" } }
    );

    const forwardedProto = req.headers
      .get("x-forwarded-proto")
      ?.split(",")[0]
      ?.trim()
      .toLowerCase();
    const isHttps =
      req.nextUrl.protocol === "https:" || forwardedProto === "https";

    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: isHttps,
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    });

    return response;
  } catch (error) {
    console.error("Auth login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
