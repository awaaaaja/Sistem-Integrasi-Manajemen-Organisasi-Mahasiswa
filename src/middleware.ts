import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/auth.config";
import { dashboardForRole } from "@/lib/auth/permissions";

const { auth } = NextAuth(authConfig);

const DASHBOARD_ROUTES: Record<string, string[]> = {
  "/dashboard/super-admin": ["super_admin"],
  "/dashboard/reviewer": ["kemahasiswaan", "lkpka", "mpm"],
  "/dashboard/koordinator": ["bem_koordinator"],
  "/dashboard/ormawa": ["admin_ormawa", "bem_koordinator"],
};

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  if (!pathname.startsWith("/dashboard")) return NextResponse.next();

  if (!session?.user) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const role = session.user.role ?? "";
  const allowed = DASHBOARD_ROUTES[pathname];

  if (allowed && !allowed.includes(role)) {
    return NextResponse.redirect(new URL(dashboardForRole(role), req.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*"],
};