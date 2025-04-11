"use client"

import { useState } from "react"
import { Star } from "lucide-react"

interface StarRatingProps {
  rating: number
  maxRating?: number
  size?: "sm" | "md" | "lg"
  interactive?: boolean
  onRatingChange?: (rating: number) => void
}

export function StarRating({
  rating,
  maxRating = 5,
  size = "md",
  interactive = false,
  onRatingChange,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0)

  // Determine star size based on the size prop
  const starSize = {
    sm: "w-3 h-3",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  }[size]

  // Calculate the percentage filled for each star
  const getStarFill = (starPosition: number) => {
    const displayRating = hoverRating > 0 && interactive ? hoverRating : rating

    if (starPosition <= Math.floor(displayRating)) {
      return 100 // Full star
    } else if (starPosition > Math.ceil(displayRating)) {
      return 0 // Empty star
    } else {
      // Partial star
      return Math.round((displayRating - Math.floor(displayRating)) * 100)
    }
  }

  const handleMouseEnter = (starPosition: number) => {
    if (interactive) {
      setHoverRating(starPosition)
    }
  }

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0)
    }
  }

  const handleClick = (starPosition: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(starPosition)
    }
  }

  return (
    <div className="flex">
      {[...Array(maxRating)].map((_, index) => {
        const starPosition = index + 1
        const fillPercentage = getStarFill(starPosition)

        return (
          <div
            key={index}
            className={`relative ${interactive ? "cursor-pointer" : ""}`}
            onMouseEnter={() => handleMouseEnter(starPosition)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(starPosition)}
          >
            {/* Empty star (background) */}
            <Star className={`${starSize} text-gray-400`} />

            {/* Filled star (overlay) */}
            {fillPercentage > 0 && (
              <div className="absolute top-0 left-0 overflow-hidden" style={{ width: `${fillPercentage}%` }}>
                <Star className={`${starSize} text-yellow-400`} />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
