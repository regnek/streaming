"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, Tv, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SeasonSelector } from "@/components/season-selector"
import { EpisodeList } from "@/components/episode-list"
import { getContentDetails, getTVShowSeason } from "@/lib/content-service"

export default function TVShowSeasonsPage() {
  const params = useParams()
  const router = useRouter()
  const showId = params.id as string

  const [show, setShow] = useState<any>(null)
  const [seasons, setSeasons] = useState<any[]>([])
  const [currentSeason, setCurrentSeason] = useState<any>(null)
  const [selectedSeasonNumber, setSelectedSeasonNumber] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  // Mock watched episodes for demo purposes
  const watchedEpisodes = [`episode-${showId}-1-1`, `episode-${showId}-1-2`]

  useEffect(() => {
    const fetchShowDetails = async () => {
      try {
        const showDetails = await getContentDetails(showId)
        setShow(showDetails)

        if (showDetails.seasons && showDetails.seasons.length > 0) {
          setSeasons(showDetails.seasons)
          // Find the first regular season (not season 0 which is often specials)
          const firstRegularSeason = showDetails.seasons.find((s: any) => s.seasonNumber > 0) || showDetails.seasons[0]
          setSelectedSeasonNumber(firstRegularSeason.seasonNumber)
        }
      } catch (error) {
        console.error("Failed to fetch show details:", error)
        setError("Failed to load show details. Please try again later.")
      }
    }

    fetchShowDetails()
  }, [showId])

  useEffect(() => {
    const fetchSeasonDetails = async () => {
      if (!selectedSeasonNumber) return

      setIsLoading(true)
      try {
        const seasonDetails = await getTVShowSeason(showId, selectedSeasonNumber)
        setCurrentSeason(seasonDetails)
      } catch (error) {
        console.error(`Failed to fetch season ${selectedSeasonNumber} details:`, error)
        setError(`Failed to load season ${selectedSeasonNumber} details. Please try again later.`)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSeasonDetails()
  }, [showId, selectedSeasonNumber])

  const handleSeasonChange = (seasonNumber: number) => {
    setSelectedSeasonNumber(seasonNumber)
  }

  if (!show) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Hero section with backdrop */}
      <div className="relative w-full h-[30vh] md:h-[40vh] overflow-hidden">
        <Image
          src={show.thumbnail || "/placeholder.svg?height=400&width=800"}
          alt={show.title}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />

        {/* Back button */}
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

      <div className="container mx-auto px-4 -mt-20 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left column - Poster and info */}
          <div className="md:w-1/4">
            <div className="relative aspect-[2/3] w-full max-w-xs mx-auto md:mx-0 rounded-lg overflow-hidden shadow-xl">
              <Image
                src={show.poster || "/placeholder.svg?height=600&width=400"}
                alt={show.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="mt-6 space-y-4">
              <h1 className="text-2xl md:text-3xl font-bold">{show.title}</h1>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-300">
                <div className="flex items-center">
                  <Tv className="w-4 h-4 text-gray-400 mr-1" />
                  <span>{show.seasonCount} Seasons</span>
                </div>

                <div className="flex items-center">
                  <Calendar className="w-4 h-4 text-gray-400 mr-1" />
                  <span>{show.releaseYear}</span>
                </div>

                {show.rating && (
                  <div className="flex items-center">
                    <span className="px-1.5 py-0.5 bg-gray-800 rounded text-xs">{show.rating}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {show.genres &&
                  show.genres.map((genre: string) => (
                    <span key={genre} className="px-3 py-1 bg-gray-800 rounded-full text-sm">
                      {genre}
                    </span>
                  ))}
              </div>

              <p className="text-gray-300 text-sm">{show.description}</p>

              <div className="pt-4">
                <Button asChild>
                  <Link href={`/watch/${show.id}`}>Watch Now</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Right column - Seasons and episodes */}
          <div className="md:w-3/4">
            <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h2 className="text-xl font-semibold">Episodes</h2>

                <SeasonSelector
                  seasons={seasons}
                  currentSeason={selectedSeasonNumber}
                  onSeasonChange={handleSeasonChange}
                />
              </div>

              {isLoading ? (
                <div className="flex justify-center py-12">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-red-400 mb-4">{error}</p>
                  <Button onClick={() => setIsLoading(true)}>Retry</Button>
                </div>
              ) : currentSeason && currentSeason.episodes && currentSeason.episodes.length > 0 ? (
                <EpisodeList
                  episodes={currentSeason.episodes}
                  showId={showId}
                  seasonNumber={selectedSeasonNumber}
                  watchedEpisodes={watchedEpisodes}
                />
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <p>No episodes available for this season.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
