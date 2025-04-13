"use client"

import { useState, useEffect, useCallback } from "react"
import { Tv } from "lucide-react"
import { getPopularTVShows } from "@/lib/content-service"
import { ContentGrid } from "@/components/content-grid"
import { Button } from "@/components/ui/button"
import { InfiniteScrollObserver } from "@/components/infinite-scroll-observer"

export default function TVShowsPage() {
  const [tvShows, setTVShows] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTVShows = useCallback(async (page = 1, isLoadingMore = false) => {
    if (page === 1) {
      setIsLoading(true)
    } else {
      setIsLoadingMore(true)
    }

    setError(null)

    try {
      const data = await getPopularTVShows(page)

      // Add rottenTomatoesRating to the data if not present
      const enhancedData = data.map((show) => ({
        ...show,
        rottenTomatoesRating: show.rottenTomatoesRating || Math.floor(Math.random() * 30) + 70, // Random rating between 70-99 for demo
      }))

      // Determine if there are more pages to load
      setHasMore(enhancedData.length >= 20)

      // Update the TV shows state
      if (isLoadingMore) {
        setTVShows((prevShows) => [...prevShows, ...enhancedData])
      } else {
        setTVShows(enhancedData)
      }
    } catch (err) {
      console.error("Failed to fetch TV shows:", err)
      setError("Failed to load TV shows. Please try again.")
      if (page === 1) {
        setTVShows([])
      }
    } finally {
      if (page === 1) {
        setIsLoading(false)
      } else {
        setIsLoadingMore(false)
      }
    }
  }, [])

  // Initial load
  useEffect(() => {
    fetchTVShows(1, false)
  }, [fetchTVShows])

  // Load more content when the user scrolls to the bottom
  const loadMore = useCallback(() => {
    if (!isLoadingMore && hasMore) {
      const nextPage = currentPage + 1
      setCurrentPage(nextPage)
      fetchTVShows(nextPage, true)
    }
  }, [currentPage, fetchTVShows, hasMore, isLoadingMore])

  return (
    <div className="min-h-screen bg-black pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Tv className="w-6 h-6 mr-2 text-primary" />
          <h1 className="text-2xl font-bold">TV Shows</h1>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error && tvShows.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">Error</h3>
            <p className="text-gray-400 mb-4">{error}</p>
            <Button onClick={() => fetchTVShows(1, false)}>Try Again</Button>
          </div>
        ) : (
          <>
            {tvShows.length > 0 ? (
              <>
                <ContentGrid
                  items={tvShows.map((show) => ({
                    ...show,
                    subtitle: `${show.episodeCount} Episodes • ${show.releaseYear}`,
                  }))}
                />

                {/* Infinite scroll observer */}
                <InfiniteScrollObserver onIntersect={loadMore} isLoading={isLoadingMore} hasMore={hasMore} />

                {/* Show a message when there are no more TV shows to load */}
                {!hasMore && tvShows.length > 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <p>You've reached the end of the list</p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2">No TV shows found</h3>
                <p className="text-gray-400">Try again later or check your connection.</p>
                <Button onClick={() => fetchTVShows(1, false)} className="mt-4">
                  Refresh
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
