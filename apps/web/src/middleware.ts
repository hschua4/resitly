import { NextResponse, type NextRequest } from "next/server";

// Better Auth's default session cookie. Verify in DevTools after first sign-in;
// update if you customize the cookie prefix in apps/api/src/auth.ts.
const SESSION_COOKIE = "better-auth.session_token";

export function middleware(req: NextRequest) {
  if (req.cookies.has(SESSION_COOKIE)) {
    return NextResponse.next();
  }
  const url = req.nextUrl.clone();
  url.pathname = "/sign-in";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/app/:path*"],
};
