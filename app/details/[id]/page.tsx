"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import {
  Play,
  Plus,
  Check,
  Star,
  Calendar,
  Clock,
  Film,
  Award,
  ChevronRight,
  ChevronLeft,
  RefreshCcw,
  List,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { StarRating } from "@/components/star-rating"
import { ReviewCard } from "@/components/review-card"
import { VideoTrailer } from "@/components/video-trailer"
import { CastMember } from "@/components/cast-member"
import { getContentDetails, ContentError } from "@/lib/content-service"
import { addToWatchlist, removeFromWatchlist, submitReview, isInWatchlist } from "@/lib/api"
import { useAuth } from "@/hooks/use-auth"

export default function DetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()

  const [details, setDetails] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [isInUserWatchlist, setIsInUserWatchlist] = useState(false)

  // Review form state
  const [userRating, setUserRating] = useState(0)
  const [reviewComment, setReviewComment] = useState("")
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)
  const [reviewError, setReviewError] = useState("")

  useEffect(() => {
    const fetchDetails = async () => {
      if (params.id) {
        setIsLoading(true)
        setError("")
        try {
          console.log(`Fetching details for content ID: ${params.id}`)
          const contentDetails = await getContentDetails(params.id as string)
          console.log("Content details fetched successfully:", contentDetails)
          setDetails(contentDetails)

          // Check if the content is in the user's watchlist
          if (user) {
            const inWatchlist = await isInWatchlist(user.id, params.id as string)
            setIsInUserWatchlist(inWatchlist)
          }
        } catch (err: any) {
          console.error(`Failed to fetch content details for ID ${params.id}:`, err)
          if (err instanceof ContentError) {
            setError(err.message)
          } else {
            setError("Failed to load details. Please try again later.")
          }
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchDetails()
  }, [params.id, user])

  const handleWatchlistToggle = async () => {
    if (!user) {
      router.push(`/login?redirect=/details/${params.id}`)
      return
    }

    try {
      if (isInUserWatchlist) {
        await removeFromWatchlist(user.id, params.id as string)
        setIsInUserWatchlist(false)
      } else {
        await addToWatchlist(user.id, params.id as string)
        setIsInUserWatchlist(true)
      }
    } catch (err: any) {
      console.error("Failed to update watchlist:", err)
    }
  }

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      router.push(`/login?redirect=/details/${params.id}`)
      return
    }

    if (userRating === 0) {
      setReviewError("Please select a rating")
      return
    }

    setIsSubmittingReview(true)
    setReviewError("")

    try {
      await submitReview(params.id as string, user.name, userRating, reviewComment)

      // Refresh the details to show the new review
      const updatedDetails = await getContentDetails(params.id as string)
      setDetails(updatedDetails)

      // Reset form
      setUserRating(0)
      setReviewComment("")
    } catch (err: any) {
      console.error("Failed to submit review:", err)
      setReviewError(err.message || "Failed to submit review")
    } finally {
      setIsSubmittingReview(false)
    }
  }

  const handleRetry = () => {
    setError("")
    setIsLoading(true)
    getContentDetails(params.id as string)
      .then((contentDetails) => {
        setDetails(contentDetails)
        setIsLoading(false)
      })
      .catch((err) => {
        console.error(`Failed to fetch content details on retry:`, err)
        if (err instanceof ContentError) {
          setError(err.message)
        } else {
          setError("Failed to load details. Please try again later.")
        }
        setIsLoading(false)
      })
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-400">Loading content details...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold mb-4">Content not found</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={handleRetry} className="flex items-center gap-2">
              <RefreshCcw className="w-4 h-4" />
              Try Again
            </Button>
            <Button variant="outline" onClick={() => router.push("/")}>
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!details) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Content not found</h1>
        <p className="text-gray-400 mb-6">The requested content could not be found.</p>
        <Button onClick={() => router.push("/")}>Back to Home</Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Hero section with backdrop */}
      <div className="relative w-full h-[50vh] md:h-[85vh] overflow-hidden">
        <Image
          src={details.thumbnail || "/placeholder.svg"}
          alt={details.title}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />

        {/* Back button */}
        <div className="relative container mx-auto">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-20 left-4 z-10 rounded-full bg-black/50"
            onClick={() => router.back()}
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="sr-only">Back</span>
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <div className="grid grid-cols-1 gap-8">
          {/* Left column - Poster and actions */}
          {/* <div className="lg:col-span-1">
            <div className="relative aspect-[2/3] w-full max-w-xs mx-auto lg:mx-0 rounded-lg overflow-hidden shadow-xl">
              <Image src={details.poster || "/placeholder.svg"} alt={details.title} fill className="object-cover" />
            </div>

            <div className="flex flex-wrap gap-3 mt-6 justify-center lg:justify-start">
              <Button asChild className="flex items-center gap-2">
                <Link href={`/watch/${details.id}`}>
                  <Play className="w-4 h-4" />
                  Watch Now
                </Link>
              </Button>

              {details.category === "tv-show" && (
                <Button variant="outline" className="flex items-center gap-2" asChild>
                  <Link href={`/tv-show/${details.id}/seasons`}>
                    <List className="w-4 h-4" />
                    View Episodes
                  </Link>
                </Button>
              )}

              <Button variant="outline" className="flex items-center gap-2" onClick={handleWatchlistToggle}>
                {isInUserWatchlist ? (
                  <>
                    <Check className="w-4 h-4" />
                    In Watchlist
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Add to Watchlist
                  </>
                )}
              </Button>
            </div>
          </div> */}

          {/* Right column - Details */}
          <div className="lg:col-span-2">
            <div className="relative -top-[8rem]">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{details.title}</h1>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-300 mb-4">
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 mr-1" />
                  <span>{details.userRating?.toFixed(1) || "N/A"}</span>
                  {details.voteCount && <span className="text-xs text-gray-500 ml-1">({details.voteCount})</span>}
                </div>

                <div className="flex items-center">
                  <Calendar className="w-4 h-4 text-gray-400 mr-1" />
                  <span>{details.releaseDate || details.releaseYear}</span>
                </div>

                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-gray-400 mr-1" />
                  <span>{details.duration}</span>
                </div>

                <div className="flex items-center">
                  <Film className="w-4 h-4 text-gray-400 mr-1" />
                  <span>{details.category === "movie" ? "Movie" : "TV Show"}</span>
                </div>

                <div className="flex items-center">
                  <Award className="w-4 h-4 text-gray-400 mr-1" />
                  <span>{details.rating}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {details.genres &&
                  details.genres.map((genre: string) => (
                    <span key={genre} className="px-3 py-1 bg-gray-800 rounded-full text-sm">
                      {genre}
                    </span>
                  ))}
              </div>

              <p className="text-gray-300 mb-8">{details.description}</p>

              <div className="flex flex-wrap gap-3 mt-6 justify-center lg:justify-start">
                <Button asChild className="flex items-center gap-2">
                  <Link href={`/watch/${details.id}`}>
                    <Play fill="#171717" className="w-4 h-4" />
                    Play
                  </Link>
                </Button>

                {details.category === "tv-show" && (
                  <Button variant="outline" className="flex items-center gap-2" asChild>
                    <Link href={`/tv-show/${details.id}/seasons`}>
                      <List className="w-4 h-4" />
                      View episodes
                    </Link>
                  </Button>
                )}

                <Button variant="outline" className="flex items-center gap-2" onClick={handleWatchlistToggle}>
                  {isInUserWatchlist ? (
                    <>
                      <Check className="w-4 h-4" />
                      In Watchlist
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Add to Watchlist
                    </>
                  )}
                </Button>
              </div>
            </div>

            {details.trailerUrl && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Trailer</h2>
                <VideoTrailer src={details.trailerUrl} poster={details.thumbnail} />
              </div>
            )}

            <Tabs defaultValue="cast" className="mb-8">
              <TabsList className="mb-4">
                <TabsTrigger value="cast">Cast & Crew</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                {details.category === "tv-show" && details.seasons && details.seasons.length > 0 && (
                  <TabsTrigger value="episodes">Seasons</TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="cast">
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-3">Cast</h3>
                  {details.cast && details.cast.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                      {details.cast.map((castMember: any) => (
                        <CastMember
                          key={`${castMember.name}-${castMember.role}`}
                          name={castMember.name}
                          role={castMember.role}
                          photo={castMember.photo}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400">Cast information not available.</p>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">{details.category === "movie" ? "Director" : "Creators"}</h3>
                  {details.category === "movie" && details.directors && details.directors.length > 0 ? (
                    <ul className="text-gray-300">
                      {details.directors.map((person: string) => (
                        <li key={person}>{person}</li>
                      ))}
                    </ul>
                  ) : details.category === "tv-show" && details.creators && details.creators.length > 0 ? (
                    <ul className="text-gray-300">
                      {details.creators.map((person: string) => (
                        <li key={person}>{person}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-400">
                      {details.category === "movie" ? "Director" : "Creator"} information not available.
                    </p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="reviews">
                <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-yellow-400 mr-1" />
                      <span className="text-xl font-bold">{details.userRating?.toFixed(1) || "N/A"}</span>
                    </div>
                    <span className="text-gray-400">
                      {details.reviews?.length || 0} {details.reviews?.length === 1 ? "review" : "reviews"}
                    </span>
                  </div>

                  {/* Review form */}
                  {user && (
                    <div className="mb-8 p-4 border border-gray-800 rounded-lg bg-gray-900/30">
                      <h3 className="text-lg font-medium mb-3">Write a Review</h3>

                      <form onSubmit={handleReviewSubmit}>
                        <div className="mb-4">
                          <label className="block text-sm font-medium mb-2">Your Rating</label>
                          <StarRating rating={userRating} size="lg" interactive onRatingChange={setUserRating} />
                        </div>

                        <div className="mb-4">
                          <label htmlFor="comment" className="block text-sm font-medium mb-2">
                            Your Review
                          </label>
                          <Textarea
                            id="comment"
                            placeholder="Share your thoughts about this title..."
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            className="bg-gray-800 border-gray-700 resize-none"
                            rows={4}
                          />
                        </div>

                        {reviewError && (
                          <div className="p-3 mb-4 bg-red-900/50 border border-red-800 rounded-md text-red-200 text-sm">
                            {reviewError}
                          </div>
                        )}

                        <Button type="submit" disabled={isSubmittingReview}>
                          {isSubmittingReview ? "Submitting..." : "Submit Review"}
                        </Button>
                      </form>
                    </div>
                  )}

                  {/* Reviews list */}
                  <div className="space-y-4">
                    {details.reviews && details.reviews.length > 0 ? (
                      details.reviews.map((review: any) => <ReviewCard key={review.id} review={review} />)
                    ) : (
                      <p className="text-gray-400">No reviews yet. Be the first to review!</p>
                    )}
                  </div>
                </div>
              </TabsContent>

              {details.category === "tv-show" && details.seasons && details.seasons.length > 0 && (
                <TabsContent value="episodes">
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium mb-3">Seasons</h3>
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/tv-show/${details.id}/seasons`}>View All Episodes</Link>
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {details.seasons.map((season: any) => (
                        <div key={season.id} className="border border-gray-800 rounded-lg overflow-hidden">
                          <div className="flex">
                            <div className="w-1/3">
                              <Image
                                src={season.poster || "/placeholder.svg"}
                                alt={season.name}
                                width={150}
                                height={225}
                                className="object-cover w-full h-full"
                              />
                            </div>
                            <div className="w-2/3 p-4">
                              <h4 className="font-medium mb-1">{season.name}</h4>
                              <div className="text-sm text-gray-400 mb-2">
                                {season.episodeCount} Episodes
                                {season.airDate && ` • ${new Date(season.airDate).getFullYear()}`}
                              </div>
                              <p className="text-sm text-gray-300 line-clamp-3">
                                {season.overview || "No overview available."}
                              </p>
                              <Button asChild size="sm" className="mt-2">
                                <Link href={`/tv-show/${details.id}/seasons?season=${season.seasonNumber}`}>
                                  View Episodes
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </div>
        </div>

        {/* Similar content section */}
        {details.similar && details.similar.length > 0 && (
          <div className="mt-12 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">More Like This</h2>
              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                See All <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {details.similar.slice(0, 5).map((item: any) => (
                <div key={item.id} className="flex flex-col">
                  <Link href={`/details/${item.id}`} className="block relative group rounded-md overflow-hidden">
                    <div className="aspect-[2/3] relative">
                      <Image
                        src={item.poster || item.thumbnail || "/placeholder.svg?height=600&width=400"}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  </Link>
                  <div className="mt-2">
                    <Link href={`/details/${item.id}`} className="hover:text-primary transition-colors">
                      <h3 className="text-sm font-medium line-clamp-1">{item.title}</h3>
                    </Link>
                    <div className="text-xs text-gray-400 mt-1">
                      {item.releaseYear}
                      {item.userRating && (
                        <>
                          <span className="mx-1">•</span>
                          <span className="flex items-center">
                            <Star className="w-3 h-3 text-yellow-400 mr-1 inline" />
                            {item.userRating.toFixed(1)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
