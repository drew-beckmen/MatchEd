import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  const currentUser = request.cookies.get('access_token')?.value
  if (currentUser && request.url.endsWith('/login')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  console.log(request.url)
  if (!currentUser && !(request.url.endsWith("/login") || request.url.endsWith("/signup"))) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  return NextResponse.next()
}
 
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.svg$).*)'],
}
