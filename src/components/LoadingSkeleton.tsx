export default function LoadingSkeleton() {
  return (
    <div className="animate-fade-in space-y-4 mt-8 w-full">
      <div className="card p-5">
        <div className="flex gap-4">
          <div className="flex-1 space-y-3">
            <div className="flex gap-2">
              <div className="skeleton h-6 w-20 rounded-full" />
              <div className="skeleton h-6 w-48" />
            </div>
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-3/4" />
          </div>
          <div className="skeleton w-24 h-24 rounded-full flex-shrink-0" />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-2">
            <div className="skeleton h-3 w-24" />
            <div className="skeleton h-7 w-20" />
            <div className="skeleton h-3 w-16" />
          </div>
        ))}
      </div>

      <div className="card p-5 space-y-3">
        <div className="skeleton h-4 w-28" />
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl">
            <div className="flex-1 space-y-1.5">
              <div className="skeleton h-4 w-32" />
              <div className="skeleton h-3 w-24" />
            </div>
            <div className="skeleton h-5 w-16" />
          </div>
        ))}
      </div>

      <div className="card p-5 space-y-3">
        <div className="skeleton h-4 w-24" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="skeleton h-3 w-20" />
            <div className="flex-1 skeleton h-1.5 rounded-full" />
            <div className="skeleton h-3 w-14" />
          </div>
        ))}
      </div>
    </div>
  )
}
