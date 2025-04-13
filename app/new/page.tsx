"use client"

import { useState, useEffect, useCallback } from "react"
import { Sparkles } from "lucide-react"

import { ContentGrid } from "@/components/content-grid"
import { getNewReleases } from "@/lib/content-service"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { InfiniteScrollObserver } from "@/components/infinite-scroll-observer"

export default function NewReleasesPage() {
  const [content, setContent] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [error, setError] = useState<string | null>(null)

  const fetchNewReleases = useCallback(async (page = 1, isLoadingMore = false) => {
    if (page === 1) {
      setIsLoading(true)
    } else {
      setIsLoadingMore(true)
    }

    setError(null)

    try {
      const data = await getNewReleases(page)

      // Determine if there are more pages to load
      setHasMore(data.length >= 20)

      // Update the content state
      if (isLoadingMore) {
        setContent((prevContent) => [...prevContent, ...data])
      } else {
        setContent(data)
      }
    } catch (error) {
      console.error("Failed to fetch new releases:", error)
      setError("Failed to load new releases. Please try again later.")
      if (page === 1) {
        setContent([])
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
    fetchNewReleases(1, false)
  }, [fetchNewReleases])

  // Filter content based on active tab
  const filteredContent = content.filter((item) => {
    if (activeTab === "all") return true
    if (activeTab === "movies") return item.category === "movie"
    if (activeTab === "tvshows") return item.category === "tv-show"
    return true
  })

  // Load more content when the user scrolls to the bottom
  const loadMore = useCallback(() => {
    if (!isLoadingMore && hasMore) {
      const nextPage = currentPage + 1
      setCurrentPage(nextPage)
      fetchNewReleases(nextPage, true)
    }
  }, [currentPage, fetchNewReleases, hasMore, isLoadingMore])

  return (
    <div className="min-h-screen bg-black pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Sparkles className="w-6 h-6 mr-2 text-primary" />
          <h1 className="text-2xl font-bold">New & Popular</h1>
        </div>

        <Tabs defaultValue="all" className="mb-8" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="movies">Movies</TabsTrigger>
            <TabsTrigger value="tvshows">TV Shows</TabsTrigger>
          </TabsList>
        </Tabs>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error && content.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">Error</h3>
            <p className="text-gray-400 mb-4">{error}</p>
            <Button onClick={() => fetchNewReleases(1, false)}>Try Again</Button>
          </div>
        ) : (
          <>
            {filteredContent.length > 0 ? (
              <>
                <ContentGrid
                  items={filteredContent.map((item) => ({
                    ...item,
                    subtitle: `${item.releaseYear} • ${
                      item.category === "movie" ? item.duration : `${item.episodeCount} Episodes`
                    }`,
                  }))}
                />

                {/* Only show the infinite scroll observer if we're not filtering */}
                {activeTab === "all" && (
                  <InfiniteScrollObserver onIntersect={loadMore} isLoading={isLoadingMore} hasMore={hasMore} />
                )}

                {/* Show a message when there are no more content to load */}
                {(!hasMore || activeTab !== "all") && filteredContent.length > 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <p>You've reached the end of the list</p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2">No new content found</h3>
                <p className="text-gray-400">Check back later for new releases.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
