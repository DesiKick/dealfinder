'use client'

import { useEffect } from 'react'

interface AdBannerProps {
  slot: string
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical'
  className?: string
}

/**
 * Google AdSense Banner Component
 *
 * Usage:
 *   <AdBanner slot="1234567890" format="horizontal" />
 *
 * Get your ad slot IDs from: https://adsense.google.com/start/
 * Replace NEXT_PUBLIC_ADSENSE_ID in .env.local with your publisher ID.
 *
 * Note: Ads only show on your live domain after AdSense approves your site.
 * During dev, you'll see an empty placeholder — that's expected.
 */
export default function AdBanner({ slot, format = 'auto', className = '' }: AdBannerProps) {
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID

  useEffect(() => {
    if (!adsenseId || adsenseId === 'ca-pub-REPLACE_ME') return
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {}
  }, [adsenseId])

  // Show placeholder in dev / before AdSense approval
  if (!adsenseId || adsenseId === 'ca-pub-REPLACE_ME') {
    return (
      <div className={`flex items-center justify-center border border-dashed border-gray-700 rounded-xl text-xs text-gray-600 ${className}`}
        style={{ minHeight: 90 }}>
        Ad space — add your AdSense ID to .env.local
      </div>
    )
  }

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={adsenseId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  )
}
