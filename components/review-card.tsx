import { StarRating } from "@/components/star-rating"

interface ReviewCardProps {
  review: {
    id: string
    user: string
    rating: number
    comment: string
    date: string
  }
}

export function ReviewCard({ review }: ReviewCardProps) {
  // Format the date
  const formattedDate = new Date(review.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="border border-gray-800 rounded-lg p-4 bg-gray-900/50">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-sm font-medium">
            {review.user.charAt(0).toUpperCase()}
          </div>
          <span className="ml-2 font-medium">{review.user}</span>
        </div>
        <StarRating rating={review.rating} size="sm" />
      </div>
      <p className="text-gray-300 text-sm mb-2">{review.comment}</p>
      <p className="text-xs text-gray-500">{formattedDate}</p>
    </div>
  )
}
