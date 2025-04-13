"use client"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { Film } from "lucide-react"

import { ContentGrid } from "@/components/content-grid"
import { ContentFilter } from "@/components/content-filter"
import { getPopularMovies } from "@/lib/content-service"
import { Button } from "@/components/ui/button"
import { InfiniteScrollObserver } from "@/components/infinite-scroll-observer"

export default function MoviesPage() {
  const searchParams = useSearchParams()
  const [movies, setMovies] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [filters, setFilters] = useState({
    genre: searchParams.get("genre") || "",
    year: searchParams.get("year") || "",
    rating: searchParams.get("rating") || "",
    sort: searchParams.get("sort") || "popularity",
  })

  // Extract unique genres, years, and ratings from movies
  const [genres, setGenres] = useState<string[]>([])
  const [years, setYears] = useState<string[]>([])
  const [ratings, setRatings] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  const fetchMovies = useCallback(
    async (page = 1, isLoadingMore = false) => {
      if (page === 1) {
        setIsLoading(true)
      } else {
        setIsLoadingMore(true)
      }

      setError(null)

      try {
        let data = await getPopularMovies(page)

        // Apply client-side filtering
        if (filters.genre && filters.genre !== "all") {
          data = data.filter(
            (movie) => movie.genres && movie.genres.some((g) => g.toLowerCase() === filters.genre.toLowerCase()),
          )
        }

        // Apply year filter if needed
        if (filters.year && filters.year !== "all") {
          data = data.filter((movie) => movie.releaseYear === filters.year)
        }

        // Apply rating filter if needed
        if (filters.rating && filters.rating !== "all") {
          data = data.filter((movie) => movie.rating === filters.rating)
        }

        // Apply client-side sorting
        switch (filters.sort) {
          case "newest":
            data.sort((a, b) => Number.parseInt(b.releaseYear) - Number.parseInt(a.releaseYear))
            break
          case "oldest":
            data.sort((a, b) => Number.parseInt(a.releaseYear) - Number.parseInt(b.releaseYear))
            break
          case "az":
            data.sort((a, b) => a.title.localeCompare(b.title))
            break
          case "za":
            data.sort((a, b) => b.title.localeCompare(a.title))
            break
          // Default is popularity, which should already be sorted by the API
        }

        // Extract filter options if this is the first page
        if (page === 1) {
          // Extract unique values for filters
          const uniqueGenres = Array.from(new Set(data.flatMap((movie) => movie.genres))).sort()
          setGenres(uniqueGenres as string[])

          const uniqueYears = Array.from(new Set(data.map((movie) => movie.releaseYear))).sort(
            (a, b) => Number.parseInt(b) - Number.parseInt(a),
          )
          setYears(uniqueYears as string[])

          const uniqueRatings = Array.from(new Set(data.map((movie) => movie.rating))).sort()
          setRatings(uniqueRatings as string[])
        }

        // Determine if there are more pages to load
        // TMDB typically has 20 items per page, so if we get fewer, we've reached the end
        setHasMore(data.length >= 20)

        // Update the movies state
        if (isLoadingMore) {
          setMovies((prevMovies) => [...prevMovies, ...data])
        } else {
          setMovies(data)
        }
      } catch (error) {
        console.error("Failed to fetch movies:", error)
        setError("Failed to load movies. Please try again later.")
        if (page === 1) {
          setMovies([])
        }
      } finally {
        if (page === 1) {
          setIsLoading(false)
        } else {
          setIsLoadingMore(false)
        }
      }
    },
    [filters],
  )

  // Initial load
  useEffect(() => {
    setCurrentPage(1)
    fetchMovies(1, false)
  }, [fetchMovies])

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
    setCurrentPage(1)
    // fetchMovies will be called by the useEffect that depends on filters
  }

  // Load more content when the user scrolls to the bottom
  const loadMore = useCallback(() => {
    if (!isLoadingMore && hasMore) {
      const nextPage = currentPage + 1
      setCurrentPage(nextPage)
      fetchMovies(nextPage, true)
    }
  }, [currentPage, fetchMovies, hasMore, isLoadingMore])

  return (
    <div className="min-h-screen bg-black pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Film className="w-6 h-6 mr-2 text-primary" />
          <h1 className="text-2xl font-bold">Movies</h1>
        </div>

        <ContentFilter genres={genres} years={years} ratings={ratings} onFilterChange={handleFilterChange} />

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error && movies.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">Error</h3>
            <p className="text-gray-400 mb-4">{error}</p>
            <Button onClick={() => fetchMovies(1, false)}>Try Again</Button>
          </div>
        ) : (
          <>
            {movies.length > 0 ? (
              <>
                <ContentGrid items={movies} />

                {/* Infinite scroll observer */}
                <InfiniteScrollObserver onIntersect={loadMore} isLoading={isLoadingMore} hasMore={hasMore} />

                {/* Show a message when there are no more movies to load */}
                {!hasMore && movies.length > 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <p>You've reached the end of the list</p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2">No movies found</h3>
                <p className="text-gray-400">Try adjusting your filters to find what you're looking for.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
