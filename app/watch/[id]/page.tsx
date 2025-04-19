"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { Play, Plus, Check, AlertCircle, RefreshCcw, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { VideoPlayer } from "@/components/video-player"
import { RelatedVideos } from "@/components/related-videos"
import { useNavigationVisibility } from "@/hooks/use-navigation-visibility"
import { getContentDetails, ContentError } from "@/lib/content-service"
import { useAuth } from "@/hooks/use-auth"
import { isInWatchlist, addToWatchlist, removeFromWatchlist } from "@/lib/api"

export default function WatchPage() {
  const params = useParams()
  const router = useRouter()
  const initialRenderComplete = useRef(false)
  const [content, setContent] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const videoContainerRef = useRef<HTMLDivElement>(null)
  const { hideNavigation } = useNavigationVisibility()
  const { user } = useAuth()
  const [isInUserWatchlist, setIsInUserWatchlist] = useState(false)

  // Mark component as mounted
  useEffect(() => {
    initialRenderComplete.current = true

    // Force hide navigation on mount
    hideNavigation()
  }, [hideNavigation])

  useEffect(() => {
    const fetchContent = async () => {
      if (params.id) {
        setIsLoading(true)
        setError(null)
        try {
          console.log(`Fetching content details for ID: ${params.id}`)
          // Use getContentDetails from content-service.ts
          const contentDetails = await getContentDetails(params.id as string)
          setContent(contentDetails)
          console.log("Content details fetched successfully:", contentDetails.title)

          // Check if the content is in the user's watchlist
          if (user) {
            const inWatchlist = await isInWatchlist(user.id, params.id as string)
            setIsInUserWatchlist(inWatchlist)
          }

          // If this is a TV show, redirect to the first episode of the first season
          if (contentDetails.category === "tv-show") {
            console.log("Content is a TV show, redirecting to first episode")
            // Get the first season number (usually 1, but could be different)
            const firstSeasonNumber =
              contentDetails.seasons && contentDetails.seasons.length > 0
                ? contentDetails.seasons.find((s: any) => s.seasonNumber > 0)?.seasonNumber || 1
                : 1

            router.push(`/watch/episode/${params.id}/1/1`)
            return
          }
        } catch (err: any) {
          console.error(`Failed to fetch content details for ID ${params.id}:`, err)
          if (err instanceof ContentError) {
            setError(err.message)
          } else {
            setError("Failed to load content. Please try again later.")
          }
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchContent()
  }, [params.id, router, user])

  const handleWatchlistToggle = async () => {
    if (!user) {
      router.push(`/login?redirect=/watch/${params.id}`)
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

  const handleRetry = () => {
    setError(null)
    setIsLoading(true)
    getContentDetails(params.id as string)
      .then((contentDetails) => {
        setContent(contentDetails)
        setIsLoading(false)
      })
      .catch((err) => {
        console.error(`Failed to fetch content details on retry:`, err)
        if (err instanceof ContentError) {
          setError(err.message)
        } else {
          setError("Failed to load content. Please try again later.")
        }
        setIsLoading(false)
      })
  }

  // Don't render anything on the server
  if (!initialRenderComplete.current) {
    return null
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription className="mb-4">{error}</AlertDescription>
          <div className="flex gap-3">
            <Button onClick={handleRetry} className="flex items-center gap-2">
              <RefreshCcw className="w-4 h-4" />
              Try Again
            </Button>
            <Button variant="outline" onClick={() => router.push("/")}>
              Back to Home
            </Button>
          </div>
        </Alert>
      </div>
    )
  }

  if (!content) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Content not found</h1>
        <Button onClick={() => router.push("/")}>Back to Home</Button>
      </div>
    )
  }

  // Construct video URL based on content type
  const videoUrl =
    content.videoUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"

  return (
    <div className="min-h-screen bg-black">
      <div ref={videoContainerRef} className="relative video-player-container">
        {/* Back button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 left-4 z-10 rounded-full bg-black/50"
          onClick={() => router.push(`/details/${content.id}`)}
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="sr-only">Back to details</span>
        </Button>

        <VideoPlayer
          src={videoUrl}
          poster={content.thumbnail}
          title={content.title}
          videoId={content.id}
          autoplay={true}
        />
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h1 className="text-2xl font-bold mb-2">{content.title}</h1>
            <div className="flex items-center text-sm text-gray-400 mb-4">
              <span>{content.releaseYear}</span>
              <span className="mx-2">•</span>
              <span>{content.duration}</span>
              <span className="mx-2">•</span>
              <span>{content.rating}</span>
            </div>

            <p className="text-gray-300 mb-6">{content.description}</p>

            <div className="flex flex-wrap gap-2 mb-8">
              {content.genres &&
                content.genres.map((genre: string) => (
                  <span key={genre} className="px-3 py-1 bg-gray-800 rounded-full text-sm">
                    {genre}
                  </span>
                ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <Button className="flex items-center gap-2">
                <Play className="w-4 h-4" />
                Play
              </Button>
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

          <div>
            <h2 className="text-xl font-semibold mb-4">More Like This</h2>
            <RelatedVideos videoId={content.id} />
          </div>
        </div>
      </div>
    </div>
  )
}
