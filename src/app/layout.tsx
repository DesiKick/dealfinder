import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

export const metadata: Metadata = {
  title: 'DealFinder — Real-Time Price Comparison & Buy Timing AI',
  description: 'Find the best deals on any product instantly. AI-powered price comparison, buy-or-wait recommendations, and real-time deal alerts.',
  keywords: 'best deals, price comparison, buy now or wait, deal finder, price tracker, shopping deals',
  openGraph: {
    title: 'DealFinder — AI-Powered Deal Finder',
    description: 'Find the best price on anything. Know exactly when to buy.',
    type: 'website',
    url: process.env.NEXT_PUBLIC_APP_URL,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DealFinder',
    description: 'AI-powered real-time deal finder',
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID

  return (
    <html lang="en">
      <head>
        {/* Google AdSense — only loads when you have an approved ID */}
        {adsenseId && adsenseId !== 'ca-pub-REPLACE_ME' && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </head>
      <body>{children}</body>
    </html>
  )
}
