export function ToolCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-lg p-6 animate-pulse">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-12 h-12 bg-muted rounded-lg shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-muted rounded w-3/4" />
          <div className="h-4 bg-muted rounded w-1/2" />
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-muted rounded w-full" />
        <div className="h-4 bg-muted rounded w-2/3" />
      </div>
      <div className="flex gap-2 mb-4">
        <div className="h-6 bg-muted rounded w-16" />
        <div className="h-6 bg-muted rounded w-20" />
      </div>
      <div className="flex justify-between items-center">
        <div className="h-4 bg-muted rounded w-24" />
        <div className="h-8 bg-muted rounded w-20" />
      </div>
    </div>
  )
}

export function CategorySkeleton() {
  return (
    <div className="flex gap-2 p-4 overflow-x-auto">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-10 bg-muted rounded-full w-24 shrink-0 animate-pulse" />
      ))}
    </div>
  )
}
