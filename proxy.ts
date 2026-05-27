import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // We are protecting any route inside (dashboard)
  // Which currently map to /student, /clinic, /parent, /admin
  const isProtectedPath =
    pathname.startsWith("/student") ||
    pathname.startsWith("/clinic") ||
    pathname.startsWith("/parent") ||
    pathname.startsWith("/admin");

  const isAuthPath = pathname.startsWith("/login");

  const role = request.cookies.get("crosshere-session-role")?.value;

  // 1. If trying to access protected route without auth, redirect to login
  /* DEV BYPASS
  if (isProtectedPath && !role) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 2. If trying to access login page WITH auth, redirect to their dashboard
  if (isAuthPath && role) {
    return NextResponse.redirect(new URL(`/${role}`, request.url));
  }

  // 3. Role-based Guard (e.g. stop student from accessing /clinic)
  if (isProtectedPath && role) {
    // If path starts with /clinic but role is not clinic
    if (pathname.startsWith("/clinic") && role !== "clinic") {
      return NextResponse.redirect(new URL(`/${role}`, request.url));
    }
    if (pathname.startsWith("/student") && role !== "student") {
      return NextResponse.redirect(new URL(`/${role}`, request.url));
    }
    if (pathname.startsWith("/parent") && role !== "parent") {
      return NextResponse.redirect(new URL(`/${role}`, request.url));
    }
    if (pathname.startsWith("/admin") && role !== "admin") {
      return NextResponse.redirect(new URL(`/${role}`, request.url));
    }
  }
  */

  // Allow root (/) to redirect to login if no auth, or dashboard if auth
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
