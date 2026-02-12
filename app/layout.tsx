import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: 'RamadanHub | Iftar & Suhoor Registration',
  description: 'Join your colleagues for blessed meals during the holy month of Ramadan 2026. Register for office Iftar and Suhoor gatherings in Abu Dhabi, UAE.',
  keywords: ['Ramadan', 'Iftar', 'Suhoor', 'Registration', 'Abu Dhabi', 'UAE', 'Office', 'Fasting'],
  authors: [{ name: 'Your Company Name' }],
  creator: 'Your Company Name',
  publisher: 'Your Company Name',
  robots: 'index, follow',
  manifest: "/manifest.json",
  themeColor: "#f59e0b",
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/apple-touch-icon.png"
  },
  openGraph: {
    type: 'website',
    locale: 'en_AE',
    url: 'https://your-domain.vercel.app',
    siteName: 'RamadanHub',
    title: 'RamadanHub | Iftar & Suhoor Registration',
    description: 'Join your colleagues for blessed meals during the holy month of Ramadan 2026.',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'RamadanHub - Iftar & Suhoor Registration',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RamadanHub | Iftar & Suhoor Registration',
    description: 'Join your colleagues for blessed meals during Ramadan 2026.',
    images: ['/images/og-image.png'],
  },
  viewport: 'width=device-width, initial-scale=1',
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
        {children}
      </body>
    </html>
  )
}
