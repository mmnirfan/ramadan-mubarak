import { NextResponse } from 'next/server'
import { SESSION_COOKIE, sessionCookieOptions } from '@/lib/auth/session'
import { noStore } from '@/lib/auth/server'

export async function POST() {
  const response = NextResponse.json({ success: true }, { headers: noStore })
  response.cookies.set(SESSION_COOKIE, '', { ...sessionCookieOptions, maxAge: 0 })
  return response
}
