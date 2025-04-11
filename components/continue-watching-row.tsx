"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Play, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getWatchHistory } from "@/lib/progress-service"
import { getContentDetails, getTVShowEpisode } from "@/lib/content-service"

export function ContinueWatchingRow() {
  const [items, setItems] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchContinueWatching = async () => {
      setIsLoading(true)

      try {
        // Get watch history from local storage
        const history = getWatchHistory()

        // Only get the 10 most recent items
        const recentHistory = history.slice(0, 10)

        // Fetch details for each item
        const itemsWithDetails = await Promise.all(
          recentHistory.map(async (item) => {
            try {
              // Handle different types of IDs
              if (item.id.startsWith("episode-")) {
                // Parse episode ID: episode-{showId}-{seasonNumber}-{episodeNumber}
                const [_, showId, seasonNumber, episodeNumber] = item.id.split("-")

                // Fetch show details
                const show = await getContentDetails(showId)

                // Fetch episode details
                const episode = await getTVShowEpisode(
                  showId,
                  Number.parseInt(seasonNumber),
                  Number.parseInt(episodeNumber),
                )

                return {
                  id: item.id,
                  title: show.title,
                  subtitle: `S${seasonNumber} E${episodeNumber}: ${episode.title}`,
                  thumbnail: episode.stillImage || show.thumbnail,
                  progress: item.percent,
                  watchUrl: `/watch/episode/${showId}/${seasonNumber}/${episodeNumber}`,
                  type: "episode",
                }
              } else {
                // Regular movie or show
                const content = await getContentDetails(item.id)

                return {
                  id: item.id,
                  title: content.title,
                  subtitle: content.category === "movie" ? "Movie" : "TV Show",
                  thumbnail: content.thumbnail,
                  progress: item.percent,
                  watchUrl: `/watch/${item.id}`,
                  type: content.category,
                }
              }
            } catch (error) {
              console.error(`Failed to fetch details for ${item.id}:`, error)
              return null
            }
          }),
        )

        // Filter out any null items (failed fetches)
        setItems(itemsWithDetails.filter(Boolean))
      } catch (error) {
        console.error("Failed to fetch continue watching:", error)
        setItems([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchContinueWatching()
  }, [])

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))

    // Also remove from local storage
    const history = getWatchHistory()
    const updatedHistory = history.filter((item) => item.id !== id)
    localStorage.setItem("streamflix_watch_history", JSON.stringify(updatedHistory))
  }

  if (isLoading) {
    return (
      <div className="h-[200px] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (items.length === 0) {
    return null
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Continue Watching</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {items.map((item) => (
          <div key={item.id} className="relative group">
            <div className="relative aspect-video rounded-md overflow-hidden">
              <Image
                src={item.thumbnail || "/placeholder.svg?height=169&width=300"}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />

              {/* Progress bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                <div className="h-full bg-primary" style={{ width: `${item.progress}%` }} />
              </div>

              {/* Play button overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button asChild size="sm" className="rounded-full">
                  <Link href={item.watchUrl}>
                    <Play className="w-4 h-4 mr-1" />
                    Resume
                  </Link>
                </Button>
              </div>

              {/* Remove button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  removeItem(item.id)
                }}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove</span>
              </Button>
            </div>

            <div className="mt-2">
              <Link href={item.watchUrl} className="hover:text-primary transition-colors">
                <h3 className="text-sm font-medium line-clamp-1">{item.title}</h3>
              </Link>
              <div className="text-xs text-gray-400 mt-1">{item.subtitle}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
