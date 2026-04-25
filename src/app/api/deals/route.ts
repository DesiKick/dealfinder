import { NextRequest, NextResponse } from 'next/server'
import { injectAffiliateTag } from '@/lib/affiliate'

const SYSTEM_PROMPT = `You are an expert deal-finding AI assistant. The user may type with typos or bad spelling — always figure out what product they mean. Search for REAL current prices from Amazon, Best Buy, Walmart, Target, Costco etc.

Return ONLY raw valid JSON, no markdown, no code fences:
{
  "product": "corrected product name",
  "verdict": "BUY_NOW" or "WAIT" or "WATCH",
  "verdict_reason": "2-3 sentences",
  "deal_score": 0-100,
  "best_price": "$XX.XX",
  "avg_price": "$XX.XX",
  "all_time_low": "$XX.XX",
  "savings_vs_avg": "XX%",
  "predicted_low": "$XX.XX",
  "best_time_to_buy": "e.g. Right now",
  "deals": [{"store":"Name","price":"$XX.XX","original_price":"$XX.XX","shipping":"Free shipping","url":"https://...","rating":"4.5/5","in_stock":true}],
  "price_history": [{"period":"3 months ago","price":"$XX.XX"},{"period":"2 months ago","price":"$XX.XX"},{"period":"1 month ago","price":"$XX.XX"},{"period":"This week","price":"$XX.XX"}],
  "alternatives": [{"name":"Product","price":"$XX.XX","reason":"Why its good","url":"https://..."}],
  "tips": ["tip1","tip2","tip3"]
}`

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json()

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 })
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 2000,
        tools: [{ type: 'web_search_20250305', name: 'web_search' }],
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: `Find best deals for: ${query.trim()}` }]
      })
    })

    const data = await response.json()
    const text = (data.content || []).filter((b: any) => b.type === 'text').map((b: any) => b.text).join('')
    const clean = text.replace(/```json|```/g, '').trim()
    const result = JSON.parse(clean)

    result.deals = result.deals.map((deal: any) => ({
      ...deal,
      url: injectAffiliateTag(deal.url, deal.store)
    }))

    return NextResponse.json(result)

  } catch (err) {
    console.error('Deal API error:', err)
    return NextResponse.json({ error: 'Failed to fetch deals. Please try again.' }, { status: 500 })
  }
}