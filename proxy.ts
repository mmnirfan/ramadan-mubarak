import { NextRequest, NextResponse } from 'next/server'
import { SESSION_COOKIE, verifySessionToken } from '@/lib/auth/session'

/**
 * Guards the admin area. Pages redirect to /signin, API calls get 401.
 * (The admin page and every admin API route also check the session themselves.)
 */
export async function proxy(request: NextRequest) {
  const session = await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value)
  if (session) return NextResponse.next()

  if (request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.json({ success: false, error: 'Not signed in' }, { status: 401 })
  }

  const signIn = new URL('/signin', request.url)
  signIn.searchParams.set('next', request.nextUrl.pathname)
  return NextResponse.redirect(signIn)
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
