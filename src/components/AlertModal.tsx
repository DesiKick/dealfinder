'use client'

import { useState } from 'react'
import { Bell, X, Check } from 'lucide-react'

interface AlertModalProps {
  product: string
  currentPrice: string
  onClose: () => void
}

export default function AlertModal({ product, currentPrice, onClose }: AlertModalProps) {
  const [email, setEmail] = useState('')
  const [targetPrice, setTargetPrice] = useState(
    currentPrice.replace('$', '').replace(/[^0-9.]/g, '')
  )
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, product, target_price: `$${targetPrice}` })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setSuccess(true)
    } catch (e: any) {
      setError(e.message || 'Failed to set alert. Try again.')
    }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-300">
          <X size={18} />
        </button>

        {success ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={24} className="text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Alert set!</h3>
            <p className="text-gray-400 text-sm">
              We'll email you when <span className="text-white">{product}</span> drops to{' '}
              <span className="text-green-400">${targetPrice}</span>.
            </p>
            <button onClick={onClose} className="btn-secondary mt-4 text-sm">Close</button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-4">
              <Bell size={18} className="text-green-400" />
              <h3 className="text-lg font-semibold text-white">Set price alert</h3>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Get notified when <span className="text-white font-medium">{product}</span> drops to your target price.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Your email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="input-base text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Target price</label>
                <div className="flex items-center bg-gray-800 border border-gray-700 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-green-500/50 focus-within:border-green-500/50">
                  <span className="px-3 text-gray-400 text-sm">$</span>
                  <input
                    type="number"
                    value={targetPrice}
                    onChange={e => setTargetPrice(e.target.value)}
                    placeholder="0.00"
                    className="flex-1 bg-transparent py-3 pr-3 text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              {error && <p className="text-red-400 text-xs">{error}</p>}

              <button
                onClick={handleSubmit}
                disabled={!email || !targetPrice || loading}
                className="btn-primary w-full text-sm"
              >
                {loading ? 'Setting alert...' : 'Set alert'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
