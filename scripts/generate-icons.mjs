// Generates all PWA / favicon / social images from the SVG sources in public/icons.
// Run with: npm run icons
import sharp from 'sharp'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'

const ICON_SVG = readFileSync('public/icons/icon-base.svg')
const OG_SVG = readFileSync('public/icons/og-image.svg')
const BACKGROUND = '#1e1b4b' // matches the icon's gradient start / manifest background

mkdirSync('public/icons', { recursive: true })

// Standard icons ("any" purpose) - the artwork fills the square
const sizes = [16, 32, 48, 72, 96, 128, 144, 152, 192, 384, 512]
for (const size of sizes) {
  const name = size <= 32 ? `favicon-${size}x${size}.png` : `icon-${size}x${size}.png`
  await sharp(ICON_SVG, { density: 384 }).resize(size, size).png().toFile(`public/icons/${name}`)
}

// Apple touch icon - iOS adds its own rounded corners, no transparency allowed
await sharp(ICON_SVG, { density: 384 }).resize(180, 180).flatten({ background: BACKGROUND }).png()
  .toFile('public/icons/apple-touch-icon.png')

// Maskable icons - Android may crop to a circle, so keep the artwork inside the
// central 80% "safe zone" on a full-bleed background
for (const size of [192, 512]) {
  const inner = Math.round(size * 0.8)
  const artwork = await sharp(ICON_SVG, { density: 384 }).resize(inner, inner).png().toBuffer()
  await sharp({ create: { width: size, height: size, channels: 4, background: BACKGROUND } })
    .composite([{ input: artwork, gravity: 'center' }])
    .png()
    .toFile(`public/icons/maskable-${size}x${size}.png`)
}

// favicon.ico (PNG-in-ICO, 32x32) for browsers that request /favicon.ico
const png32 = await sharp(ICON_SVG, { density: 384 }).resize(32, 32).png().toBuffer()
const header = Buffer.alloc(22)
header.writeUInt16LE(0, 0) // reserved
header.writeUInt16LE(1, 2) // type: icon
header.writeUInt16LE(1, 4) // image count
header.writeUInt8(32, 6) // width
header.writeUInt8(32, 7) // height
header.writeUInt8(0, 8) // palette
header.writeUInt8(0, 9) // reserved
header.writeUInt16LE(1, 10) // colour planes
header.writeUInt16LE(32, 12) // bits per pixel
header.writeUInt32LE(png32.length, 14) // image size
header.writeUInt32LE(22, 18) // image offset
writeFileSync('app/favicon.ico', Buffer.concat([header, png32]))

// Social sharing image (Open Graph / Twitter) - must be PNG/JPG, 1200x630
mkdirSync('public/images', { recursive: true })
await sharp(OG_SVG, { density: 144 }).resize(1200, 630).png().toFile('public/images/og-image.png')

console.log('Icons generated')
