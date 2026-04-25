'use client'

import { useState, useRef, useCallback } from 'react'
import { Search, Loader2, Mic } from 'lucide-react'
import clsx from 'clsx'

const TRENDING = [
  'Sony WH-1000XM5', 'iPhone 15 Pro', 'MacBook Air M3',
  'Dyson V15', 'PS5', 'Nintendo Switch OLED',
  'Samsung 65" 4K TV', 'AirPods Pro 2', 'iPad Pro',
  'LG C3 OLED', 'Roomba j7+', 'Kindle Paperwhite',
]

interface SearchBarProps {
  onSearch: (query: string) => void
  loading: boolean
}

export default function SearchBar({ onSearch, loading }: SearchBarProps) {
  const [value, setValue] = useState('')
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const submit = useCallback(() => {
    const q = value.trim()
    if (!q || loading) return
    onSearch(q)
    setFocused(false)
  }, [value, loading, onSearch])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') submit()
    if (e.key === 'Escape') setFocused(false)
  }

  const handleTrending = (item: string) => {
    setValue(item)
    onSearch(item)
    setFocused(false)
  }

  // Voice search — uses Web Speech API
  const handleVoice = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice search not supported in your browser. Try Chrome.')
      return
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.start()
    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript
      setValue(transcript)
      onSearch(transcript)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Search input */}
      <div className={clsx(
        'flex items-center gap-2 bg-gray-900 border rounded-2xl px-4 py-3 transition-all duration-200',
        focused ? 'border-green-500/60 ring-2 ring-green-500/20' : 'border-gray-700 hover:border-gray-600'
      )}>
        {loading
          ? <Loader2 size={18} className="text-green-400 animate-spin flex-shrink-0" />
          : <Search size={18} className="text-gray-500 flex-shrink-0" />
        }
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          placeholder="Search any product — typos OK (e.g. 'soni hedfonez')"
          className="flex-1 bg-transparent text-gray-100 placeholder-gray-600 text-base focus:outline-none"
          autoComplete="off"
          spellCheck={false}
        />
        <button
          onClick={handleVoice}
          className="text-gray-500 hover:text-gray-300 transition-colors p-1"
          title="Voice search"
          type="button"
        >
          <Mic size={16} />
        </button>
        <button
          onClick={submit}
          disabled={loading || !value.trim()}
          className="btn-primary text-sm py-2 px-4 ml-1"
          type="button"
        >
          {loading ? 'Searching...' : 'Find deals'}
        </button>
      </div>

      {/* Trending searches */}
      <div className="mt-4">
        <p className="text-xs text-gray-600 mb-2 text-center">Trending searches</p>
        <div className="flex flex-wrap justify-center gap-2">
          {TRENDING.map(item => (
            <button
              key={item}
              onClick={() => handleTrending(item)}
              className="text-xs px-3 py-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 rounded-full text-gray-400 hover:text-gray-200 transition-all"
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
