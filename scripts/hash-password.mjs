// Creates the ADMIN_PASSWORD_HASH value for .env.local / your hosting settings.
// Run: npm run hash-password   (you'll be asked for the password; it isn't saved anywhere)
import { scrypt, randomBytes } from 'node:crypto'
import { createInterface } from 'node:readline/promises'

const COST = { N: 16384, r: 8, p: 1 }

const rl = createInterface({ input: process.stdin, output: process.stdout })
const password = (await rl.question('Admin password (min 10 characters): ')).trim()
rl.close()

if (password.length < 10) {
  console.error('Password must be at least 10 characters.')
  process.exit(1)
}

const salt = randomBytes(16)
const key = await new Promise((resolve, reject) =>
  scrypt(password, salt, 64, { ...COST, maxmem: 64 * 1024 * 1024 }, (e, k) => (e ? reject(e) : resolve(k)))
)
// Colons, not $, because Next.js expands $NAME inside .env files
const hash = ['scrypt', COST.N, COST.r, COST.p, salt.toString('base64'), key.toString('base64')].join(':')

console.log('\nAdd this line to .env.local (and to your hosting environment variables):\n')
console.log(`ADMIN_PASSWORD_HASH=${hash}`)
console.log('\nAnd a random session secret, if you have not set one yet:\n')
console.log(`SESSION_SECRET=${randomBytes(32).toString('base64url')}`)
