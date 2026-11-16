// Next.js 16 "proxy" (formerly middleware): optimistic auth gate for the admin area.
// Every admin API route ALSO verifies the session itself (defence in depth).
import { NextResponse } from "next/server";
import { COOKIE, verifySession } from "@/lib/auth";

export async function proxy(request) {
  const { pathname } = request.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();
  const session = await verifySession(request.cookies.get(COOKIE)?.value);
  if (session) return NextResponse.next();
  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ ok: false, error: "Unauthorised" }, { status: 401 });
  }
  const url = request.nextUrl.clone();
  url.pathname = "/admin/login";
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
