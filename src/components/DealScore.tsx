'use client'

interface DealScoreProps {
  score: number
}

export default function DealScore({ score }: DealScoreProps) {
  const clamped = Math.max(0, Math.min(100, score))
  const radius = 40
  const circumference = 2 * Math.PI * radius
  const strokeDash = (clamped / 100) * circumference

  const color = clamped >= 80 ? '#22c55e'
    : clamped >= 60 ? '#84cc16'
    : clamped >= 40 ? '#eab308'
    : clamped >= 20 ? '#f97316'
    : '#ef4444'

  const label = clamped >= 80 ? 'Excellent'
    : clamped >= 60 ? 'Good'
    : clamped >= 40 ? 'Fair'
    : clamped >= 20 ? 'Poor'
    : 'Avoid'

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="#1f2937" strokeWidth="8" />
        <circle
          cx="50" cy="50" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${strokeDash} ${circumference}`}
          transform="rotate(-90 50 50)"
          style={{ transition: 'stroke-dasharray 0.8s ease' }}
        />
        <text x="50" y="46" textAnchor="middle" fill="white" fontSize="18" fontWeight="600">{clamped}</text>
        <text x="50" y="62" textAnchor="middle" fill="#6b7280" fontSize="9">/100</text>
      </svg>
      <span className="text-xs font-medium" style={{ color }}>{label} deal</span>
    </div>
  )
}
