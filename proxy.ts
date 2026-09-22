import { auth } from "@/auth";

export const proxy = auth((request) => {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/admin") &&
    !pathname.startsWith("/admin/login") &&
    !request.auth
  ) {
    return Response.redirect(
      new URL("/admin/login", request.nextUrl)
    );
  }

  if (
    pathname === "/admin/login" &&
    request.auth
  ) {
    return Response.redirect(
      new URL("/admin", request.nextUrl)
    );
  }
});

export const config = {
  matcher: ["/admin/:path*"],
};