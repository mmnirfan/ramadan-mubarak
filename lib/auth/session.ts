/**
 * Admin session: a signed, expiring token stored in an HttpOnly cookie.
 * Uses Web Crypto (HMAC-SHA256) so it works in the proxy and in route handlers.
 *
 * Token format: base64url(JSON payload) + "." + base64url(signature)
 */

export const SESSION_COOKIE = 'rh_admin_session'
export const SESSION_MAX_AGE = 8 * 60 * 60 // seconds - one working shift

interface SessionPayload {
  sub: string // admin username
  exp: number // expiry, seconds since epoch
}

const encoder = new TextEncoder()

function base64url(bytes: Uint8Array): string {
  let binary = ''
  bytes.forEach((b) => { binary += String.fromCharCode(b) })
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromBase64url(value: string): Uint8Array {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (value.length % 4)) % 4)
  const binary = atob(padded)
  return Uint8Array.from(binary, (c) => c.charCodeAt(0))
}

/**
 * The signing secret. Returns null when it's missing or too short, which
 * disables admin sign-in instead of signing with a weak key.
 */
function getSecret(): string | null {
  const secret = process.env.SESSION_SECRET
  return secret && secret.length >= 32 ? secret : null
}

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify'])
}

export function isSessionConfigured(): boolean {
  return getSecret() !== null
}

export async function createSessionToken(username: string): Promise<string> {
  const secret = getSecret()
  if (!secret) throw new Error('SESSION_SECRET is not set (min 32 characters)')
  const payload: SessionPayload = { sub: username, exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE }
  const body = base64url(encoder.encode(JSON.stringify(payload)))
  const signature = await crypto.subtle.sign('HMAC', await hmacKey(secret), encoder.encode(body))
  return `${body}.${base64url(new Uint8Array(signature))}`
}

/**
 * Returns the session payload if the token is authentic and not expired, otherwise null.
 */
export async function verifySessionToken(token: string | undefined): Promise<SessionPayload | null> {
  const secret = getSecret()
  if (!secret || !token) return null

  const [body, signature] = token.split('.')
  if (!body || !signature) return null

  try {
    // crypto.subtle.verify compares in constant time
    const valid = await crypto.subtle.verify(
      'HMAC',
      await hmacKey(secret),
      fromBase64url(signature) as BufferSource,
      encoder.encode(body)
    )
    if (!valid) return null

    const payload = JSON.parse(new TextDecoder().decode(fromBase64url(body))) as SessionPayload
    if (typeof payload.sub !== 'string' || typeof payload.exp !== 'number') return null
    if (payload.exp < Math.floor(Date.now() / 1000)) return null
    return payload
  } catch {
    return null
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
  maxAge: SESSION_MAX_AGE,
}
