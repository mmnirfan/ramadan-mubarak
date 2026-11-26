import { scrypt, randomBytes, timingSafeEqual } from 'node:crypto'

/**
 * Admin password hashing with scrypt (Node.js only - used by the login route
 * and scripts/hash-password.mjs).
 *
 * Hash format: scrypt:<N>:<r>:<p>:<salt base64>:<hash base64>
 * (colons, not $, because Next.js expands $NAME inside .env files)
 */

const KEY_LENGTH = 64
const COST = { N: 16384, r: 8, p: 1 }

function scryptAsync(password: string, salt: Buffer, params: typeof COST): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, KEY_LENGTH, { ...params, maxmem: 64 * 1024 * 1024 }, (error, key) =>
      error ? reject(error) : resolve(key)
    )
  })
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16)
  const key = await scryptAsync(password, salt, COST)
  return ['scrypt', COST.N, COST.r, COST.p, salt.toString('base64'), key.toString('base64')].join(':')
}

export async function verifyPassword(password: string, stored: string | undefined): Promise<boolean> {
  if (!stored) return false
  const [scheme, N, r, p, salt, hash] = stored.split(':')
  if (scheme !== 'scrypt' || !salt || !hash) return false

  const expected = Buffer.from(hash, 'base64')
  const actual = await scryptAsync(password, Buffer.from(salt, 'base64'), { N: Number(N), r: Number(r), p: Number(p) })
  return actual.length === expected.length && timingSafeEqual(actual, expected)
}

/**
 * Constant-time string comparison (for the username)
 */
export function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a)
  const right = Buffer.from(b)
  // Compare against itself when lengths differ so timing doesn't reveal the length
  return left.length === right.length ? timingSafeEqual(left, right) : (timingSafeEqual(left, left), false)
}
