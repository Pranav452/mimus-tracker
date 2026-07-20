import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Cookie-presence gate only — role checks happen server-side in layouts.
export function proxy(request: NextRequest) {
  const hasSession = request.cookies.has("mimus_session");
  const { pathname } = request.nextUrl;
  const isAuthPage = pathname === "/login";

  if (!hasSession && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (hasSession && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    // everything except static files, sw, manifest, icons, api push endpoints
    "/((?!_next|api|icons|assets|sw\\.js|manifest\\.webmanifest|favicon\\.ico).*)",
  ],
};
