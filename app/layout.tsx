import type { Metadata, Viewport } from 'next'
import './globals.css'
import ClientLayout from '@/components/ClientLayout'
import Analytics from '@/components/Analytics'
import Footer from '@/components/Footer'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ameyaprod.com'
const siteName = 'AMEYA PROD'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'AMEYA PROD - Director & Editor',
    template: '%s | AMEYA PROD',
  },
  description: 'Director and video editor specializing in music videos, commercials, and cinematic storytelling. Based in Paris, available worldwide.',
  keywords: ['director', 'video editor', 'music video', 'cinematic', 'filmmaker', 'video production', 'Paris'],
  authors: [{ name: 'AMEYA PROD' }],
  creator: 'AMEYA PROD',
  publisher: 'AMEYA PROD',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: siteUrl,
    siteName: siteName,
    title: 'AMEYA PROD - Director & Editor',
    description: 'Director and video editor specializing in music videos, commercials, and cinematic storytelling.',
    images: [
      {
        url: `${siteUrl}/logo-ameya-white-png.png`,
        width: 1200,
        height: 630,
        alt: 'AMEYA PROD',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AMEYA PROD - Director & Editor',
    description: 'Director and video editor specializing in music videos, commercials, and cinematic storytelling.',
    images: [`${siteUrl}/logo-ameya-white-png.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/favicon-apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'android-chrome',
        url: '/favicon-android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        rel: 'android-chrome',
        url: '/favicon-android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  },
  manifest: '/site.webmanifest',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>
        <Analytics />
        <ClientLayout>
          {children}
          <Footer />
        </ClientLayout>
      </body>
    </html>
  )
}

