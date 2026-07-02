import { NextResponse, type NextRequest } from "next/server";

// Better Auth's session cookie. Over HTTPS (production) Better Auth prefixes it
// with "__Secure-"; over HTTP (local dev) it's unprefixed. Check both so the
// guard works in every environment. Requires the cookie to be scoped to the
// shared parent domain (COOKIE_DOMAIN=.hschua.com) so it reaches this host.
const SESSION_COOKIES = [
  "better-auth.session_token",
  "__Secure-better-auth.session_token",
];

export function proxy(req: NextRequest) {
  if (SESSION_COOKIES.some((name) => req.cookies.has(name))) {
    return NextResponse.next();
  }
  const url = req.nextUrl.clone();
  url.pathname = "/sign-in";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/app/:path*", "/v2/:path*"],
};
