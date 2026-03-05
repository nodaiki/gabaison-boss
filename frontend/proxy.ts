// proxy.ts（app/と同階層・middleware.tsの代わり）
import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest): NextResponse {
  const token = request.cookies.get("auth_token")?.value;
  const { pathname } = request.nextUrl;

  const isPublic = pathname.startsWith("/login") ||
                   pathname.startsWith("/signup");

  // if (!isPublic && !token) {
  //   return NextResponse.redirect(new URL("/login", request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};