import type { Metadata, Viewport } from "next";
import { SerwistProvider } from "@serwist/turbopack/react";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n";

const SITE_URL = 'https://ramadan-mubarak-delta.vercel.app'
const TITLE = 'RamadanHub | Sehri Registration - Hoskote'
const DESCRIPTION =
  'Register or cancel Sehri during Ramadan 2027 if you stay in a PG, hostel or room in Hoskote, Bengaluru Rural and cannot prepare Sehri yourself. Includes the daily Sehri and Iftar timetable.'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0f172a',
  colorScheme: 'dark',
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: 'RamadanHub',
  title: {
    default: TITLE,
    template: '%s | RamadanHub',
  },
  description: DESCRIPTION,
  keywords: [
    'Ramadan 2027', 'Sehri', 'Sehri registration', 'Suhoor', 'Sehri timetable', 'Iftar time',
    'Hoskote', 'Bengaluru Rural', 'Bangalore', 'PG', 'Hostel', 'Fasting', 'Roza', 'Masjid',
    'سحری', 'رمضان', 'ہوسکوٹے',
  ],
  authors: [{ name: 'RamadanHub Hoskote' }],
  creator: 'RamadanHub Hoskote',
  publisher: 'RamadanHub Hoskote',
  category: 'community',
  robots: { index: true, follow: true },
  alternates: { canonical: '/' },
  manifest: '/manifest.json',
  formatDetection: { telephone: false, email: false, address: false },
  appleWebApp: {
    capable: true,
    title: 'RamadanHub',
    statusBarStyle: 'black-translucent',
  },
  icons: {
    // /favicon.ico is added automatically from app/favicon.ico
    icon: [
      { url: '/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    alternateLocale: ['ur_IN'],
    url: SITE_URL,
    siteName: 'RamadanHub',
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'RamadanHub - Sehri Registration, Hoskote',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/images/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-slate-950 text-white">
        {/* Service worker only in production, so development never serves stale cached pages */}
        <SerwistProvider swUrl="/serwist/sw.js" disable={process.env.NODE_ENV === 'development'}>
          <LanguageProvider>{children}</LanguageProvider>
        </SerwistProvider>
      </body>
    </html>
  )
}
