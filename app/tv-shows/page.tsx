"use client"

import { useState, useEffect } from "react"
import { Tv } from "lucide-react"
import { getTVShows } from "@/lib/api"
import { ContentGrid } from "@/components/content-grid"
import { Button } from "@/components/ui/button"

export default function TVShowsPage() {
  const [tvShows, setTVShows] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTVShows = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await getTVShows({})
        setTVShows(data)
      } catch (err) {
        console.error("Failed to fetch TV shows:", err)
        setError("Failed to load TV shows. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTVShows()
  }, [])

  const handleRetry = () => {
    setIsLoading(true)
    setError(null)
    getTVShows({})
      .then((data) => {
        setTVShows(data)
        setIsLoading(false)
      })
      .catch((err) => {
        console.error("Failed to fetch TV shows on retry:", err)
        setError("Failed to load TV shows. Please try again.")
        setIsLoading(false)
      })
  }

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
        ) : error ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">Error</h3>
            <p className="text-gray-400 mb-4">{error}</p>
            <Button onClick={handleRetry}>Try Again</Button>
          </div>
        ) : (
          <>
            {tvShows.length > 0 ? (
              <ContentGrid
                items={tvShows.map((show) => ({
                  ...show,
                  subtitle: `${show.episodeCount} Episodes • ${show.releaseYear}`,
                }))}
              />
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2">No TV shows found</h3>
                <p className="text-gray-400">Try again later or check your connection.</p>
                <Button onClick={handleRetry} className="mt-4">
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
