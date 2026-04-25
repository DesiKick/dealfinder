/**
 * Injects affiliate tracking tags into deal URLs.
 * Sign up for each program and add your IDs to .env.local
 *
 * Amazon Associates:  https://affiliate-program.amazon.com
 * Best Buy Affiliate: https://www.bestbuy.com/site/help/affiliate-program/pcmcat159400050011.c
 * Walmart Affiliate:  https://affiliates.walmart.com
 * Target Affiliate:   https://partners.target.com
 */

export function injectAffiliateTag(url: string, store: string): string {
  try {
    const parsed = new URL(url)

    if (store.toLowerCase().includes('amazon') || parsed.hostname.includes('amazon')) {
      const tag = process.env.AMAZON_AFFILIATE_TAG
      if (tag && tag !== 'REPLACE_ME-20') {
        parsed.searchParams.set('tag', tag)
        parsed.searchParams.set('linkCode', 'ogi')
      }
    }

    if (store.toLowerCase().includes('best buy') || parsed.hostname.includes('bestbuy')) {
      const id = process.env.BESTBUY_AFFILIATE_ID
      if (id && id !== 'REPLACE_ME') {
        // Best Buy uses Commission Junction — prepend their tracking URL
        return `https://api.bestbuy.com/click/-/${id}/pdp?url=${encodeURIComponent(url)}`
      }
    }

    if (store.toLowerCase().includes('walmart') || parsed.hostname.includes('walmart')) {
      const id = process.env.WALMART_AFFILIATE_ID
      if (id && id !== 'REPLACE_ME') {
        parsed.searchParams.set('affiliateId', id)
      }
    }

    return parsed.toString()
  } catch {
    return url
  }
}
