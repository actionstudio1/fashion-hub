import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionValue } from "@/lib/session";

/** Sends visitors without a valid admin session to the login page. */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authed = verifySessionValue(request.cookies.get(SESSION_COOKIE)?.value, Date.now());
  if (pathname === "/admin/login") {
    return authed ? NextResponse.redirect(new URL("/admin", request.url)) : NextResponse.next();
  }
  if (!authed) return NextResponse.redirect(new URL("/admin/login", request.url));
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
