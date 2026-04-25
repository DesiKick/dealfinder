'use client'

import { useState } from 'react'
import { ExternalLink, Bell, TrendingDown, TrendingUp, Minus, Star, CheckCircle, XCircle, Lightbulb, Shuffle } from 'lucide-react'
import type { DealResult } from '@/lib/types'
import DealScore from './DealScore'
import AlertModal from './AlertModal'
import AdBanner from './AdBanner'
import clsx from 'clsx'

interface DealResultsProps {
  result: DealResult
}

export default function DealResults({ result }: DealResultsProps) {
  const [showAlert, setShowAlert] = useState(false)

  const verdictConfig = {
    BUY_NOW: { label: 'Buy now', color: 'bg-green-500/20 text-green-400 border-green-500/30', dot: 'bg-green-400' },
    WAIT:    { label: 'Wait',     color: 'bg-amber-500/20 text-amber-400 border-amber-500/30', dot: 'bg-amber-400' },
    WATCH:   { label: 'Watch',    color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',   dot: 'bg-blue-400' },
  }
  const vc = verdictConfig[result.verdict]

  const prices = result.price_history.map(h => parseFloat(h.price.replace(/[^0-9.]/g, '')))
  const maxP = Math.max(...prices)
  const minP = Math.min(...prices)

  return (
    <div className="animate-slide-up space-y-4 mt-8 w-full">

      {/* Ad — top of results (high visibility) */}
      <AdBanner slot="TOP_RESULTS_SLOT_ID" format="horizontal" className="mb-2" />

      {/* ── Verdict card ── */}
      <div className="card p-5">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className={clsx('badge border', vc.color)}>
                <span className={clsx('w-1.5 h-1.5 rounded-full mr-1.5', vc.dot)} />
                {vc.label}
              </span>
              <h2 className="text-lg font-semibold text-white">{result.product}</h2>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">{result.verdict_reason}</p>
            <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
              <span>Best time: <span className="text-green-400 font-medium">{result.best_time_to_buy}</span></span>
              <span>·</span>
              <span>Predicted low: <span className="text-white font-medium">{result.predicted_low}</span></span>
            </div>
          </div>
          <DealScore score={result.deal_score} />
        </div>
      </div>

      {/* ── Metrics ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Best price now', value: result.best_price, sub: 'lowest today' },
          { label: 'Average price',  value: result.avg_price,  sub: 'across stores' },
          { label: 'All-time low',   value: result.all_time_low, sub: 'historical best' },
          { label: 'You save',       value: result.savings_vs_avg, sub: 'vs average' },
        ].map(m => (
          <div key={m.label} className="bg-gray-900 border border-gray-800 rounded-xl p-3 sm:p-4">
            <p className="text-xs text-gray-500 mb-1">{m.label}</p>
            <p className="text-xl sm:text-2xl font-semibold text-white">{m.value}</p>
            <p className="text-xs text-gray-600 mt-0.5">{m.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Deals ── */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-300">Current deals</h3>
          <button
            onClick={() => setShowAlert(true)}
            className="flex items-center gap-1.5 text-xs text-green-400 hover:text-green-300 transition-colors"
          >
            <Bell size={13} />
            Set price alert
          </button>
        </div>

        <div className="space-y-2">
          {result.deals.map((deal, i) => (
            <div key={i} className={clsx(
              'flex items-center gap-3 p-3 rounded-xl border transition-colors',
              i === 0
                ? 'bg-green-500/5 border-green-500/30'
                : 'bg-gray-800/50 border-gray-800 hover:border-gray-700'
            )}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-white">{deal.store}</span>
                  {i === 0 && <span className="badge bg-green-500/20 text-green-400 border border-green-500/30">Best price</span>}
                  {deal.in_stock === false && <span className="badge bg-red-500/20 text-red-400 border border-red-500/30">Out of stock</span>}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-gray-500">{deal.shipping}</span>
                  {deal.rating && (
                    <>
                      <span className="text-gray-700">·</span>
                      <span className="text-xs text-gray-500 flex items-center gap-0.5">
                        <Star size={10} className="text-amber-400" />{deal.rating}
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {deal.original_price && deal.original_price !== deal.price && (
                  <span className="text-xs text-gray-600 line-through">{deal.original_price}</span>
                )}
                <span className="text-base font-semibold text-white">{deal.price}</span>
                <a href={deal.url} target="_blank" rel="noopener noreferrer"
                  className="p-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                  <ExternalLink size={13} className="text-gray-300" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ad — mid-page (between sections) */}
      <AdBanner slot="MID_RESULTS_SLOT_ID" format="rectangle" />

      {/* ── Price trend ── */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-gray-300 mb-4">Price trend</h3>
        <div className="space-y-2.5">
          {result.price_history.map((h, i) => {
            const val = parseFloat(h.price.replace(/[^0-9.]/g, ''))
            const pct = maxP === minP ? 50 : Math.round(((val - minP) / (maxP - minP)) * 100)
            const barColor = pct < 35 ? '#22c55e' : pct > 65 ? '#f97316' : '#3b82f6'
            const isLast = i === result.price_history.length - 1
            const prevVal = i > 0 ? parseFloat(result.price_history[i-1].price.replace(/[^0-9.]/g,'')) : null
            const trend = prevVal === null ? null : val < prevVal ? 'down' : val > prevVal ? 'up' : 'flat'
            return (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-24 flex-shrink-0">{h.period}</span>
                <div className="flex-1 bg-gray-800 rounded-full h-1.5 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, background: barColor }} />
                </div>
                <div className="flex items-center gap-1 w-20 justify-end flex-shrink-0">
                  {trend === 'down' && <TrendingDown size={11} className="text-green-400" />}
                  {trend === 'up'   && <TrendingUp   size={11} className="text-red-400" />}
                  {trend === 'flat' && <Minus         size={11} className="text-gray-500" />}
                  <span className={clsx('text-xs font-medium', isLast ? 'text-white' : 'text-gray-400')}>{h.price}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Alternatives ── */}
      {result.alternatives?.length > 0 && (
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Shuffle size={14} className="text-purple-400" />
            <h3 className="text-sm font-semibold text-gray-300">Smarter alternatives</h3>
          </div>
          <div className="space-y-2">
            {result.alternatives.map((alt, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-gray-800/50 border border-gray-800 rounded-xl hover:border-gray-700 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{alt.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">{alt.reason}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-sm font-semibold text-white">{alt.price}</span>
                  <a href={alt.url} target="_blank" rel="noopener noreferrer"
                    className="p-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                    <ExternalLink size={13} className="text-gray-300" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Buying tips ── */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb size={14} className="text-amber-400" />
          <h3 className="text-sm font-semibold text-gray-300">Buying tips</h3>
        </div>
        <ul className="space-y-2">
          {result.tips.map((tip, i) => (
            <li key={i} className="flex gap-2.5 text-sm text-gray-400">
              <span className="text-green-500 flex-shrink-0 mt-0.5">✓</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>

      {/* Alert modal */}
      {showAlert && (
        <AlertModal
          product={result.product}
          currentPrice={result.best_price}
          onClose={() => setShowAlert(false)}
        />
      )}
    </div>
  )
}
