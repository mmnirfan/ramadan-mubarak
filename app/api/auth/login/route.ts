import { NextRequest, NextResponse } from 'next/server'
import { createSessionToken, isSessionConfigured, SESSION_COOKIE, sessionCookieOptions } from '@/lib/auth/session'
import { safeEqual, verifyPassword } from '@/lib/auth/password'
import { isSameOrigin, noStore } from '@/lib/auth/server'

// Simple per-IP limit on failed attempts (per server instance)
const MAX_FAILURES = 5
const WINDOW_MS = 15 * 60 * 1000
const failures = new Map<string, { count: number; first: number }>()

function clientIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0].trim() || request.headers.get('x-real-ip') || 'unknown'
}

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 403, headers: noStore })
  }

  const username = process.env.ADMIN_USERNAME
  const passwordHash = process.env.ADMIN_PASSWORD_HASH
  if (!isSessionConfigured() || !username || !passwordHash) {
    return NextResponse.json(
      { success: false, error: 'Admin sign-in is not configured on the server' },
      { status: 503, headers: noStore }
    )
  }

  const ip = clientIp(request)
  const entry = failures.get(ip)
  if (entry && Date.now() - entry.first < WINDOW_MS && entry.count >= MAX_FAILURES) {
    return NextResponse.json(
      { success: false, error: 'Too many attempts. Please try again in 15 minutes.' },
      { status: 429, headers: noStore }
    )
  }

  let body: { username?: unknown; password?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400, headers: noStore })
  }

  const givenUser = typeof body.username === 'string' ? body.username.trim() : ''
  const givenPassword = typeof body.password === 'string' ? body.password : ''

  // Always run the password check so a wrong username takes as long as a wrong password
  const passwordOk = await verifyPassword(givenPassword, passwordHash)
  const userOk = safeEqual(givenUser.toLowerCase(), username.toLowerCase())

  if (!passwordOk || !userOk) {
    const current = entry && Date.now() - entry.first < WINDOW_MS ? entry : { count: 0, first: Date.now() }
    failures.set(ip, { count: current.count + 1, first: current.first })
    return NextResponse.json({ success: false, error: 'Incorrect username or password' }, { status: 401, headers: noStore })
  }

  failures.delete(ip)
  const response = NextResponse.json({ success: true }, { headers: noStore })
  response.cookies.set(SESSION_COOKIE, await createSessionToken(username), sessionCookieOptions)
  return response
}
