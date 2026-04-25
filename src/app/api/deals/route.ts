import { NextRequest, NextResponse } from 'next/server'
import { injectAffiliateTag } from '@/lib/affiliate'

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json()
    if (!query) return NextResponse.json({ error: 'Query required' }, { status: 400 })
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 2000,
        tools: [{ type: 'web_search_20250305', name: 'web_search' }],
        system: 'You are a deal-finding AI. Find real prices. Return ONLY raw JSON no markdown: {"product":"name","verdict":"BUY_NOW","verdict_reason":"reason","deal_score":75,"best_price":"$X","avg_price":"$X","all_time_low":"$X","savings_vs_avg":"X%","predicted_low":"$X","best_time_to_buy":"now","deals":[{"store":"Name","price":"$X","original_price":"$X","shipping":"Free","url":"https://...","rating":"4.5/5","in_stock":true}],"price_history":[{"period":"3 months ago","price":"$X"},{"period":"1 month ago","price":"$X"},{"period":"This week","price":"$X"}],"alternatives":[{"name":"Product","price":"$X","reason":"why","url":"https://..."}],"tips":["tip1","tip2"]}',
        messages: [{ role: 'user', content: 'Find best deals for: ' + query }]
      })
    })
    const data = await response.json()
    const text = (data.content || []).filter((b: any) => b.type === 'text').map((b: any) => b.text).join('')
    const result = JSON.parse(text.replace(/```json|```/g, '').trim())
    result.deals = result.deals.map((d: any) => ({ ...d, url: injectAffiliateTag(d.url, d.store) }))
    return NextResponse.json(result)
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch deals' }, { status: 500 })
  }
}
