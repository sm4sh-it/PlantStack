import { NextRequest, NextResponse } from "next/server";
import {
  getAuthSecret,
  deriveSessionToken,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE,
} from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const secret = getAuthSecret();
    if (!secret) {
      return NextResponse.json({
        success: true,
        message: "No authentication configured (LAN mode)",
      });
    }

    const body = await req.json();
    const password = typeof body.password === "string" ? body.password.trim() : "";

    if (password !== secret) {
      return NextResponse.json(
        { error: "Invalid password or API secret" },
        { status: 401 }
      );
    }

    const token = await deriveSessionToken(secret);
    const response = NextResponse.json({ success: true });

    const isHttps =
      req.nextUrl.protocol === "https:" ||
      req.headers.get("x-forwarded-proto") === "https";

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
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
