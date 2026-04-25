export interface Deal {
  store: string
  price: string
  original_price?: string
  shipping: string
  url: string
  rating?: string
  in_stock?: boolean
}

export interface PricePoint {
  period: string
  price: string
}

export interface DealResult {
  product: string
  verdict: 'BUY_NOW' | 'WAIT' | 'WATCH'
  verdict_reason: string
  deal_score: number          // 0–100 (100 = steal, 0 = terrible deal)
  best_price: string
  avg_price: string
  all_time_low: string
  savings_vs_avg: string
  predicted_low: string       // AI predicted upcoming low
  best_time_to_buy: string    // e.g. "Black Friday", "In 3 weeks"
  deals: Deal[]
  price_history: PricePoint[]
  alternatives: Alternative[]
  tips: string[]
}

export interface Alternative {
  name: string
  price: string
  reason: string
  url: string
}

export interface AlertRequest {
  email: string
  product: string
  target_price: string
}
