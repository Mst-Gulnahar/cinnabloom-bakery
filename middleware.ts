// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define exact protected route paths
const PROTECTED_ROUTES = ["/items/add", "/items/manage", "/profile"];
const AUTH_ROUTES = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Retrieve token from cookies (Set this cookie upon successful login)
  const token = request.cookies.get("token")?.value;

  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  // 1. Unauthenticated user trying to access protected page -> Redirect to /login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname); // Redirect back after login
    return NextResponse.redirect(loginUrl);
  }

  // 2. Authenticated user trying to access /login or /register -> Redirect to /items/manage
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/items/manage", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/items/add/:path*",
    "/items/manage/:path*",
    "/profile/:path*",
    "/login",
    "/register",
  ],
};