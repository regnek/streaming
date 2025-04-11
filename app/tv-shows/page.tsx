"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Tv } from "lucide-react"

import { ContentGrid } from "@/components/content-grid"
import { ContentFilter } from "@/components/content-filter"
import { getTVShows } from "@/lib/api"

export default function TVShowsPage() {
  const searchParams = useSearchParams()
  const [tvShows, setTVShows] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState({
    genre: searchParams.get("genre") || "",
    year: searchParams.get("year") || "",
    rating: searchParams.get("rating") || "",
    sort: searchParams.get("sort") || "popularity",
  })

  // Extract unique genres, years, and ratings from TV shows
  const [genres, setGenres] = useState<string[]>([])
  const [years, setYears] = useState<string[]>([])
  const [ratings, setRatings] = useState<string[]>([])

  useEffect(() => {
    const fetchTVShows = async () => {
      setIsLoading(true)
      try {
        const data = await getTVShows(filters)
        setTVShows(data)

        // Extract unique values for filters
        if (genres.length === 0) {
          const uniqueGenres = Array.from(new Set(data.flatMap((show) => show.genres))).sort()
          setGenres(uniqueGenres as string[])
        }

        if (years.length === 0) {
          const uniqueYears = Array.from(new Set(data.map((show) => show.releaseYear))).sort(
            (a, b) => Number.parseInt(b) - Number.parseInt(a),
          )
          setYears(uniqueYears as string[])
        }

        if (ratings.length === 0) {
          const uniqueRatings = Array.from(new Set(data.map((show) => show.rating))).sort()
          setRatings(uniqueRatings as string[])
        }
      } catch (error) {
        console.error("Failed to fetch TV shows:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTVShows()
  }, [filters, genres.length, years.length, ratings.length])

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }

  return (
    <div className="min-h-screen bg-black pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Tv className="w-6 h-6 mr-2 text-primary" />
          <h1 className="text-2xl font-bold">TV Shows</h1>
        </div>

        <ContentFilter genres={genres} years={years} ratings={ratings} onFilterChange={handleFilterChange} />

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {tvShows.length > 0 ? (
              <div>
                <ContentGrid
                  items={tvShows.map((show) => ({
                    ...show,
                    subtitle: `${show.episodeCount} Episodes • ${show.releaseYear}`,
                  }))}
                />
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2">No TV shows found</h3>
                <p className="text-gray-400">Try adjusting your filters to find what you're looking for.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
