"use client"

import { useState, useEffect } from "react"
import { FeaturedContent } from "@/components/featured-content"
import { ContentRow } from "@/components/content-row"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { RefreshCcw } from "lucide-react"
import { getTrendingContent, getPopularMovies, getPopularTVShows, getNewReleases } from "@/lib/content-service"

export default function Home() {
  const [trendingContent, setTrendingContent] = useState<any[]>([])
  const [popularMovies, setPopularMovies] = useState<any[]>([])
  const [popularTVShows, setPopularTVShows] = useState<any[]>([])
  const [newReleases, setNewReleases] = useState<any[]>([])
  const [featuredContent, setFeaturedContent] = useState<any>(null)

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchHomePageData()
  }, [])

  const fetchHomePageData = async () => {
    setIsLoading(true)
    setError("")

    try {
      // Fetch all data in parallel
      const [trending, movies, tvShows, newContent] = await Promise.all([
        getTrendingContent(),
        getPopularMovies(),
        getPopularTVShows(),
        getNewReleases(),
      ])

      setTrendingContent(trending)
      setPopularMovies(movies)
      setPopularTVShows(tvShows)
      setNewReleases(newContent)

      // Set a random trending item as featured content
      if (trending.length > 0) {
        const randomIndex = Math.floor(Math.random() * Math.min(5, trending.length))
        setFeaturedContent(trending[randomIndex])
      }
    } catch (error) {
      console.error("Failed to fetch home page data:", error)
      setError("Failed to load content. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription className="mb-4">{error}</AlertDescription>
          <Button onClick={fetchHomePageData} className="flex items-center gap-2">
            <RefreshCcw className="w-4 h-4" />
            Try Again
          </Button>
        </Alert>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {featuredContent && <FeaturedContent content={featuredContent} />}

      <div className="container px-4 py-8 mx-auto space-y-8">
        <ContentRow title="Trending Now" seeAllLink="/trending" items={trendingContent} />

        <ContentRow title="Popular Movies" seeAllLink="/movies" items={popularMovies} />

        <ContentRow title="Popular TV Shows" seeAllLink="/tv-shows" items={popularTVShows} />

        <ContentRow title="New Releases" seeAllLink="/new" items={newReleases} />
      </div>
    </div>
  )
}
