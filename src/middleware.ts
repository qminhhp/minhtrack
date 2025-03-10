import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const token = req.cookies.get("auth_token")?.value;

  let isAuthenticated = false;
  let userId = null;

  if (token) {
    try {
      // Verify the token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "your-secret-key"
      ) as { id: string; email: string };
      
      isAuthenticated = true;
      userId = decoded.id;
    } catch (error) {
      console.error("Auth token error:", error);
      // Token is invalid, clear it
      res.cookies.delete("auth_token");
    }
  }

  // Redirect authenticated users to dashboard from home page
  if (req.nextUrl.pathname === "/" && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Redirect unauthenticated users away from protected routes
  if (req.nextUrl.pathname.startsWith("/dashboard") && !isAuthenticated) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  return res;
}

// Ensure the middleware is only called for relevant paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    "/((?!_next/static|_next/image|favicon.ico|public|api).*)",
  ],
};
