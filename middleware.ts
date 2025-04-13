import { type NextRequest, NextResponse } from "next/server"

// Routes that require authentication
const protectedRoutes = ["/profile", "/watchlist", "/continue-watching", "/admin"]

// Routes that should redirect to home if already authenticated
const authRoutes = ["/login", "/signup"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the user is authenticated by looking for the session cookie
  const sessionCookie = request.cookies.get("streamflix_session")
  const isAuthenticated = !!sessionCookie

  // If the route requires authentication and the user is not authenticated
  if (protectedRoutes.some((route) => pathname.startsWith(route)) && !isAuthenticated) {
    const url = new URL("/login", request.url)
    url.searchParams.set("redirect", pathname)
    return NextResponse.redirect(url)
  }

  // If the route is an auth route and the user is already authenticated
  if (authRoutes.includes(pathname) && isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
