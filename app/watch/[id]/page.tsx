"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { Play, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { getVideoById } from "@/lib/api"
import { VideoPlayer } from "@/components/video-player"
import { RelatedVideos } from "@/components/related-videos"
import { useNavigationVisibility } from "@/hooks/use-navigation-visibility"

export default function WatchPage() {
  const params = useParams()
  const router = useRouter()
  const initialRenderComplete = useRef(false)
  const [video, setVideo] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const videoContainerRef = useRef<HTMLDivElement>(null)
  const { hideNavigation } = useNavigationVisibility()

  // Mark component as mounted
  useEffect(() => {
    initialRenderComplete.current = true

    // Force hide navigation on mount
    hideNavigation()
  }, [hideNavigation])

  useEffect(() => {
    const fetchVideo = async () => {
      if (params.id) {
        setIsLoading(true)
        try {
          console.log(`Fetching video details for ID: ${params.id}`)
          // In a real app, this would fetch from an API
          const videoData = await getVideoById(params.id as string)
          setVideo(videoData)
          console.log("Video details fetched successfully:", videoData.title)

          // If this is a TV show, redirect to the first episode of the first season
          if (videoData.category === "tv-show") {
            console.log("Content is a TV show, redirecting to first episode")
            // Get the first season number (usually 1, but could be different)
            const firstSeasonNumber =
              videoData.seasons && videoData.seasons.length > 0
                ? videoData.seasons.find((s: any) => s.seasonNumber > 0)?.seasonNumber || 1
                : 1

            router.push(`/watch/episode/${params.id}/1/1`)
            return
          }
        } catch (error) {
          console.error("Failed to fetch video:", error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchVideo()
  }, [params.id, router])

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

  if (!video) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Video not found</h1>
        <Button onClick={() => router.push("/")}>Back to Home</Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <div ref={videoContainerRef} className="relative video-player-container">
        <VideoPlayer
          src={video.videoUrl}
          poster={video.thumbnail}
          title={video.title}
          videoId={video.id}
          autoplay={true} // Enable autoplay for movies
        />
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h1 className="text-2xl font-bold mb-2">{video.title}</h1>
            <div className="flex items-center text-sm text-gray-400 mb-4">
              <span>{video.releaseYear}</span>
              <span className="mx-2">•</span>
              <span>{video.duration}</span>
              <span className="mx-2">•</span>
              <span>{video.rating}</span>
            </div>

            <p className="text-gray-300 mb-6">{video.description}</p>

            <div className="flex flex-wrap gap-2 mb-8">
              {video.genres.map((genre: string) => (
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
              <Button variant="outline" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add to Watchlist
              </Button>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">More Like This</h2>
            <RelatedVideos videoId={video.id} />
          </div>
        </div>
      </div>
    </div>
  )
}
