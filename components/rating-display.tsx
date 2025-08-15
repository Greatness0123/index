import { Star } from "lucide-react"

interface RatingDisplayProps {
  rating: number
  ratingCount: number
  size?: "sm" | "md" | "lg"
}

export function RatingDisplay({ rating, ratingCount, size = "md" }: RatingDisplayProps) {
  const starSize = size === "sm" ? "h-3 w-3" : size === "lg" ? "h-5 w-5" : "h-4 w-4"
  const textSize = size === "sm" ? "text-xs" : size === "lg" ? "text-lg" : "text-sm"

  if (rating === 0 || ratingCount === 0) {
    return (
      <div className={`flex items-center gap-1 ${textSize} text-muted-foreground`}>
        <Star className={`${starSize} text-muted-foreground`} />
        <span>No ratings yet</span>
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-1 ${textSize}`}>
      <Star className={`${starSize} fill-yellow-400 text-yellow-400`} />
      <span className="font-medium">{rating.toFixed(1)}</span>
      <span className="text-muted-foreground">({ratingCount} reviews)</span>
    </div>
  )
}
