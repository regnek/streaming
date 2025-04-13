import { CherryIcon as Tomato } from "lucide-react"

interface RottenTomatoesRatingProps {
  rating: number
  size?: "sm" | "md" | "lg"
  showText?: boolean
}

export function RottenTomatoesRating({ rating, size = "md", showText = true }: RottenTomatoesRatingProps) {
  // Determine if the rating is "fresh" (≥ 60%) or "rotten" (< 60%)
  const isFresh = rating >= 60

  // Determine icon size based on the size prop
  const iconSize = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  }[size]

  // Determine text size based on the size prop
  const textSize = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  }[size]

  return (
    <div className="flex items-center gap-1">
      <div className={`${iconSize} ${isFresh ? "text-green-500" : "text-red-500"}`}>
        <Tomato className="fill-current" />
      </div>
      {showText && <span className={`${textSize} font-medium`}>{rating}%</span>}
    </div>
  )
}
