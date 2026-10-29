import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#f59e0b',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://ramadan-mubarak-delta.vercel.app'),
  title:'RamadanHub | Iftar & Sehri Registration',
  description: 'Join your colleagues for blessed meals during the holy month of Ramadan 2027. Register for office Iftar and Sehri gatherings in Bengaluru, India.',
  keywords: ['Ramadan', 'Iftar', 'Suhoor', 'Registration', 'Bengaluru', 'Bangalore', 'India', 'Sehri', 'Office', 'Fasting'],
  authors: [{ name: 'Your Company Name' }],
  creator: 'Your Company Name',
  publisher: 'Your Company Name',
  robots: 'index, follow',
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/apple-touch-icon.png"
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://ramadan-mubarak-delta.vercel.app',
    siteName: 'RamadanHub',
    title: 'RamadanHub | Iftar & Sehri Registration',
    description: 'Join your colleagues for blessed meals during the holy month of Ramadan 2027.',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'RamadanHub - Iftar & Sehri Registration',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RamadanHub | Iftar & Sehri Registration',
    description: 'Join your colleagues for blessed meals during Ramadan 2027.',
    images: ['/images/og-image.png'],
  },
  // themeColor: '#0f172a',
  // icons: {
  //   icon: '/favicon.ico',
  //   apple: '/apple-touch-icon.png',
  // },
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
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  )
}
