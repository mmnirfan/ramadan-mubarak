import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { SESSION_COOKIE, verifySessionToken } from './session'

/**
 * Current admin session from the request cookies (server components / route handlers)
 */
export async function getAdminSession() {
  const store = await cookies()
  return verifySessionToken(store.get(SESSION_COOKIE)?.value)
}

/**
 * For state-changing admin requests: the session cookie is SameSite=Strict, and
 * we additionally require the request to come from this site (CSRF protection).
 */
export function isSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin')
  if (!origin) return false
  try {
    return new URL(origin).host === request.headers.get('host')
  } catch {
    return false
  }
}

export function unauthorized() {
  return NextResponse.json({ success: false, error: 'Not signed in' }, { status: 401, headers: noStore })
}

export const noStore = { 'Cache-Control': 'no-store' }
