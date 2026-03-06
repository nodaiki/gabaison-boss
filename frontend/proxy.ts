// proxy.ts（app/と同階層・middleware.tsの代わり）
import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest): NextResponse {
  const token = request.cookies.get("access_token")?.value;
  const frontendAuth = request.cookies.get("frontend_auth")?.value;
  const { pathname } = request.nextUrl;

  const isPublic =
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup");

  const hasSession = Boolean(token) || frontendAuth === "1";
  if (!isPublic && !hasSession) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
