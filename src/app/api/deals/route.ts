import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { injectAffiliateTag } from '@/lib/affiliate'
import type { DealResult } from '@/lib/types'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const SYSTEM_PROMPT = `You are an expert deal-finding AI assistant for DealFinder.ai. 

The user may type with typos, slang, abbreviations, or bad spelling — always intelligently figure out what product they mean. For example "soni hedfonz" = Sony headphones, "iphone pro max 15" = iPhone 15 Pro Max, "dysen vacuum" = Dyson vacuum.

Use your web search tool to find REAL current prices from major retailers: Amazon, Best Buy, Walmart, Target, Costco, B&H Photo, Newegg, Apple Store, Samsung, etc.

Return ONLY a raw valid JSON object — no markdown, no code fences, no explanation before or after. Just the JSON.

Required shape:
{
  "product": "corrected, clean product name",
  "verdict": "BUY_NOW" | "WAIT" | "WATCH",
  "verdict_reason": "2-3 sentence explanation of the verdict",
  "deal_score": <integer 0-100 where 100 = incredible steal, 50 = fair price, 0 = terrible deal>,
  "best_price": "$XX.XX",
  "avg_price": "$XX.XX",
  "all_time_low": "$XX.XX",
  "savings_vs_avg": "XX%",
  "predicted_low": "$XX.XX",
  "best_time_to_buy": "e.g. Black Friday, In 3 weeks, Right now",
  "deals": [
    {
      "store": "Store Name",
      "price": "$XX.XX",
      "original_price": "$XX.XX or null",
      "shipping": "Free shipping / $X.XX shipping",
      "url": "https://actual-product-url.com",
      "rating": "4.5/5 (2,847 reviews) or null",
      "in_stock": true
    }
  ],
  "price_history": [
    { "period": "6 months ago", "price": "$XX.XX" },
    { "period": "3 months ago", "price": "$XX.XX" },
    { "period": "1 month ago", "price": "$XX.XX" },
    { "period": "2 weeks ago", "price": "$XX.XX" },
    { "period": "This week",   "price": "$XX.XX" }
  ],
  "alternatives": [
    {
      "name": "Product Name",
      "price": "$XX.XX",
      "reason": "Why this is a good alternative (1 sentence)",
      "url": "https://..."
    }
  ],
  "tips": ["tip 1", "tip 2", "tip 3", "tip 4"]
}

Include up to 5 deals, 2-3 alternatives, 4 tips. All prices must be realistic and current.
Deal score logic: distance from all-time-low matters most. At all-time-low = 95-100. Within 5% = 80-94. Average price = 50. Above average = below 50.`

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json()

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 })
    }

    if (query.trim().length > 200) {
      return NextResponse.json({ error: 'Query too long' }, { status: 400 })
    }

    const response = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 2000,
      tools: [{ type: 'web_search_20250305', name: 'web_search' } as any],
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Find the best current deals for: ${query.trim()}`
        }
      ]
    })

    const textBlock = response.content.find(b => b.type === 'text')
    if (!textBlock || textBlock.type !== 'text') {
      throw new Error('No text response from AI')
    }

    const clean = textBlock.text.replace(/```json|```/g, '').trim()
    const result: DealResult = JSON.parse(clean)

    // Inject affiliate tags server-side
    result.deals = result.deals.map(deal => ({
      ...deal,
      url: injectAffiliateTag(deal.url, deal.store)
    }))
    result.alternatives = result.alternatives.map(alt => ({
      ...alt,
      url: injectAffiliateTag(alt.url, alt.name)
    }))

    return NextResponse.json(result)

  } catch (err) {
    console.error('Deal API error:', err)
    return NextResponse.json(
      { error: 'Failed to fetch deals. Please try again.' },
      { status: 500 }
    )
  }
}
