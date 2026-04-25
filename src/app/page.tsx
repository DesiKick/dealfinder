'use client'

import { useState, useCallback } from 'react'
import { Zap, TrendingDown, Shield, Mic } from 'lucide-react'
import SearchBar from '@/components/SearchBar'
import DealResults from '@/components/DealResults'
import LoadingSkeleton from '@/components/LoadingSkeleton'
import AdBanner from '@/components/AdBanner'
import type { DealResult } from '@/lib/types'

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<DealResult | null>(null)
  const [error, setError] = useState('')
  const [lastQuery, setLastQuery] = useState('')

  const handleSearch = useCallback(async (query: string) => {
    setError('')
    setLoading(true)
    setResult(null)
    setLastQuery(query)

    try {
      const res = await fetch('/api/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')
      setResult(data)
    } catch (e: any) {
      setError(e.message || 'Failed to fetch deals. Please try again.')
    }

    setLoading(false)
  }, [])

  const hasResults = result || loading

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Subtle grid background */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#111111_1px,transparent_1px),linear-gradient(to_bottom,#111111_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30 pointer-events-none" />

      {/* Nav */}
      <nav className="relative z-10 border-b border-gray-900 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-green-500 rounded-lg flex items-center justify-center">
              <TrendingDown size={14} className="text-gray-950" />
            </div>
            <span className="font-bold text-white text-base tracking-tight">DealFinder</span>
            <span className="badge bg-green-500/20 text-green-400 border border-green-500/30 ml-1">AI</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="hidden sm:flex items-center gap-1">
              <Shield size={11} className="text-green-400" /> No tracking
            </span>
            <span className="hidden sm:flex items-center gap-1">
              <Zap size={11} className="text-green-400" /> Real-time
            </span>
          </div>
        </div>
      </nav>

      <main className="relative z-10 px-4 pb-20">
        <div className="max-w-4xl mx-auto">

          {/* Hero — shown until first search */}
          {!hasResults && (
            <div className="text-center pt-16 pb-10 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-xs mb-6">
                <Zap size={11} />
                AI-powered · Real-time prices · Typo-tolerant
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight leading-tight">
                Find the best deal<br className="hidden sm:block" /> on anything
              </h1>
              <p className="text-gray-400 text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
                Real-time price comparison across 50+ stores. AI tells you exactly when to buy — or when to wait.
              </p>

              <SearchBar onSearch={handleSearch} loading={loading} />

              {/* Features row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-14 text-left max-w-2xl mx-auto">
                {[
                  { icon: <TrendingDown size={16} className="text-green-400" />, title: 'Buy or wait verdict', desc: 'AI analyzes price history and tells you the optimal time to buy.' },
                  { icon: <Zap size={16} className="text-amber-400" />, title: 'Deal score 0–100', desc: 'Instantly see how good a deal is compared to historical prices.' },
                  { icon: <Shield size={16} className="text-blue-400" />, title: 'Price drop alerts', desc: 'Set a target price and get emailed the moment it drops.' },
                ].map(f => (
                  <div key={f.title} className="card p-4">
                    <div className="mb-2">{f.icon}</div>
                    <p className="text-sm font-medium text-white mb-1">{f.title}</p>
                    <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>

              {/* Ad below features */}
              <div className="mt-8">
                <AdBanner slot="HOMEPAGE_BOTTOM_SLOT_ID" format="horizontal" />
              </div>
            </div>
          )}

          {/* Search bar — sticky at top when results shown */}
          {hasResults && (
            <div className="pt-6 pb-2">
              <SearchBar onSearch={handleSearch} loading={loading} />
              {lastQuery && !loading && (
                <p className="text-xs text-gray-600 text-center mt-2">
                  Results for "{lastQuery}"
                </p>
              )}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Loading */}
          {loading && <LoadingSkeleton />}

          {/* Results */}
          {result && !loading && <DealResults result={result} />}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-900 px-4 py-6 mt-10">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
          <p>© 2025 DealFinder. Prices updated in real-time via AI web search.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-gray-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-gray-400 transition-colors">Terms</a>
            <a href="#" className="hover:text-gray-400 transition-colors">Contact</a>
          </div>
        </div>
        <p className="text-center text-xs text-gray-700 mt-3">
          Some links are affiliate links. We may earn a commission at no extra cost to you.
        </p>
      </footer>
    </div>
  )
}
