import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_PATHS = ['/login', '/register', '/onboarding', '/landing']
const PUBLIC_API_PREFIXES = ['/api/auth/']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public pages
  if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  // Allow all /api/* — routes check the session themselves and return JSON 401
  if (pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  // Check session cookie exists
  const session = request.cookies.get('session')
  if (!session?.value) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|_next).*)',
  ],
}
