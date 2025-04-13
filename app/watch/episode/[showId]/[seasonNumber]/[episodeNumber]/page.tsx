"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, ChevronRight, ListVideo, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { VideoPlayer } from "@/components/video-player"
import { EpisodeList } from "@/components/episode-list"
import { SeasonSelector } from "@/components/season-selector"
import {
  getContentDetails,
  getTVShowSeason,
  getTVShowEpisode,
  getNextEpisode,
  getPreviousEpisode,
  getTVShowSeasons,
} from "@/lib/content-service"
import { getWatchedEpisodes } from "@/lib/progress-service"

export default function EpisodeWatchPage() {
  const params = useParams()
  const router = useRouter()

  const [showId, setShowId] = useState(params.showId as string)
  const [seasonNumber, setSeasonNumber] = useState(Number.parseInt(params.seasonNumber as string, 10))
  const [episodeNumber, setEpisodeNumber] = useState(Number.parseInt(params.episodeNumber as string, 10))

  const [show, setShow] = useState<any>(null)
  const [episode, setEpisode] = useState<any>(null)
  const [seasonEpisodes, setSeasonEpisodes] = useState<any[]>([])
  const [nextEpisode, setNextEpisode] = useState<any>(null)
  const [previousEpisode, setPreviousEpisode] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [showEpisodeList, setShowEpisodeList] = useState(true)
  const [watchedEpisodes, setWatchedEpisodes] = useState<string[]>([])
  const [hasMounted, setHasMounted] = useState(false)

  // New state for season selection
  const [availableSeasons, setAvailableSeasons] = useState<any[]>([])
  const [selectedSeasonNumber, setSelectedSeasonNumber] = useState(seasonNumber)
  const [isLoadingSeasonEpisodes, setIsLoadingSeasonEpisodes] = useState(false)

  // Create a function to fetch episode data that can be reused
  const fetchEpisodeData = useCallback(async (showId: string, seasonNumber: number, episodeNumber: number) => {
    try {
      // Fetch current episode
      const episodeDetails = await getTVShowEpisode(showId, seasonNumber, episodeNumber)

      // Fetch next and previous episodes
      const next = await getNextEpisode(showId, seasonNumber, episodeNumber).catch(() => null)
      const prev = await getPreviousEpisode(showId, seasonNumber, episodeNumber).catch(() => null)

      return { episodeDetails, next, prev }
    } catch (error) {
      console.error("Failed to fetch episode data:", error)
      throw error
    }
  }, [])

  // Function to handle episode change during seamless transition
  const handleEpisodeChange = useCallback(
    async (videoId: string) => {
      console.log("Episode change triggered with videoId:", videoId)

      // Parse the episode ID to extract the new episode information
      // Format: episode-{showId}-{seasonNumber}-{episodeNumber}
      const parts = videoId.split("-")

      // We need at least 4 parts: "episode", showId, seasonNumber, episodeNumber
      if (parts.length >= 4) {
        let newShowId, newSeasonNumber, newEpisodeNumber

        // Handle different ID formats
        if (parts[0] === "episode") {
          if (parts.length === 4) {
            // Simple format: episode-showId-seasonNumber-episodeNumber
            newShowId = parts[1]
            newSeasonNumber = Number.parseInt(parts[2], 10)
            newEpisodeNumber = Number.parseInt(parts[3], 10)
          } else if (parts.length > 4) {
            // Complex format: episode-tv-12345-seasonNumber-episodeNumber
            // or any format where showId contains hyphens
            newShowId = parts.slice(1, parts.length - 2).join("-")
            newSeasonNumber = Number.parseInt(parts[parts.length - 2], 10)
            newEpisodeNumber = Number.parseInt(parts[parts.length - 1], 10)
          }

          // Validate parsed values
          if (newShowId && !isNaN(newSeasonNumber) && !isNaN(newEpisodeNumber)) {
            console.log(
              `Parsed episode data: Show ID=${newShowId}, Season=${newSeasonNumber}, Episode=${newEpisodeNumber}`,
            )

            // Update URL without full page navigation
            const newUrl = `/watch/episode/${newShowId}/${newSeasonNumber}/${newEpisodeNumber}`
            console.log("Updating URL to:", newUrl)
            window.history.pushState({}, "", newUrl)

            // Update state variables
            setShowId(newShowId)
            setSeasonNumber(newSeasonNumber)
            setEpisodeNumber(newEpisodeNumber)
            setSelectedSeasonNumber(newSeasonNumber) // Update selected season as well

            // Fetch data for the next episode after this one
            try {
              const { next } = await fetchEpisodeData(newShowId, newSeasonNumber, newEpisodeNumber)
              setNextEpisode(next)
            } catch (error) {
              console.error("Failed to fetch next episode data after transition:", error)
            }
          } else {
            console.error("Failed to parse episode ID components:", { newShowId, newSeasonNumber, newEpisodeNumber })
          }
        } else {
          console.error("Invalid episode ID format, doesn't start with 'episode':", videoId)
        }
      } else {
        console.error("Invalid episode ID format, not enough parts:", videoId)
      }
    },
    [fetchEpisodeData],
  )

  useEffect(() => {
    setHasMounted(true)
  }, [])

  // Fetch show details and all seasons
  useEffect(() => {
    if (!hasMounted) {
      return
    }

    let didCancel = false

    const fetchShowData = async () => {
      setIsLoading(true)
      setError("")

      try {
        // Fetch show details
        const showDetails = await getContentDetails(showId)
        if (!didCancel) {
          setShow(showDetails)
        }

        // Fetch all seasons for the show
        const seasons = await getTVShowSeasons(showId)
        if (!didCancel) {
          setAvailableSeasons(seasons)
        }

        // Get watched episodes
        const watched = getWatchedEpisodes()
        if (!didCancel) {
          setWatchedEpisodes(watched)
        }
      } catch (err) {
        console.error("Failed to fetch show data:", err)
        if (!didCancel) {
          setError("Failed to load show details. Please try again later.")
        }
      } finally {
        if (!didCancel) {
          setIsLoading(false)
        }
      }
    }

    fetchShowData()

    return () => {
      didCancel = true
    }
  }, [showId, hasMounted])

  // Fetch current episode data
  useEffect(() => {
    if (!hasMounted) {
      return
    }

    let didCancel = false

    const fetchCurrentEpisodeData = async () => {
      setIsLoading(true)
      setError("")

      try {
        // Fetch episode data
        const { episodeDetails, next, prev } = await fetchEpisodeData(showId, seasonNumber, episodeNumber)
        if (!didCancel) {
          setEpisode(episodeDetails)
          setNextEpisode(next)
          setPreviousEpisode(prev)

          // Set the selected season to match the current episode's season
          setSelectedSeasonNumber(seasonNumber)
        }
      } catch (err) {
        console.error("Failed to fetch episode data:", err)
        if (!didCancel) {
          setError("Failed to load episode. Please try again later.")
        }
      } finally {
        if (!didCancel) {
          setIsLoading(false)
        }
      }
    }

    fetchCurrentEpisodeData()

    return () => {
      didCancel = true
    }
  }, [showId, seasonNumber, episodeNumber, fetchEpisodeData, hasMounted])

  // Fetch episodes for the selected season
  useEffect(() => {
    if (!hasMounted || !selectedSeasonNumber) {
      return
    }

    let didCancel = false

    const fetchSeasonEpisodes = async () => {
      setIsLoadingSeasonEpisodes(true)

      try {
        // Fetch all episodes for the selected season
        const seasonDetails = await getTVShowSeason(showId, selectedSeasonNumber)
        if (!didCancel) {
          setSeasonEpisodes(seasonDetails.episodes || [])
        }
      } catch (err) {
        console.error(`Failed to fetch episodes for season ${selectedSeasonNumber}:`, err)
        if (!didCancel) {
          setSeasonEpisodes([])
        }
      } finally {
        if (!didCancel) {
          setIsLoadingSeasonEpisodes(false)
        }
      }
    }

    fetchSeasonEpisodes()

    return () => {
      didCancel = true
    }
  }, [showId, selectedSeasonNumber, hasMounted])

  // Add logging to debug the episode data
  useEffect(() => {
    if (nextEpisode) {
      console.log("Next episode data:", {
        id: nextEpisode.id,
        showId: nextEpisode.showId,
        seasonNumber: nextEpisode.seasonNumber,
        episodeNumber: nextEpisode.episodeNumber,
        title: nextEpisode.title,
      })
    }
  }, [nextEpisode])

  const navigateToEpisode = (targetShowId: string, targetSeasonNumber: number, targetEpisodeNumber: number) => {
    // Construct the URL properly
    const url = `/watch/episode/${targetShowId}/${targetSeasonNumber}/${targetEpisodeNumber}`
    console.log("Navigating to:", url)

    // Use router.push for client-side navigation
    router.push(url)
  }

  // Handle season change
  const handleSeasonChange = (newSeasonNumber: number) => {
    setSelectedSeasonNumber(newSeasonNumber)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error || !episode || !show) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p className="text-gray-400 mb-6">{error || "Episode not found"}</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    )
  }

  const episodeTitle = `${show.title} - S${seasonNumber}E${episodeNumber}: ${episode.title}`

  // Prepare next episode data for seamless transition
  const nextEpisodeData = nextEpisode
    ? {
        src: nextEpisode.videoUrl,
        poster: nextEpisode.stillImage,
        title: `${show.title} - S${nextEpisode.seasonNumber}E${nextEpisode.episodeNumber}: ${nextEpisode.title}`,
        videoId: nextEpisode.id, // This should already be in the correct format from the API
        creditsStartTime: nextEpisode.runtime ? nextEpisode.runtime * 60 - 30 : undefined,
      }
    : undefined

  return (
    <div className="min-h-screen bg-black">
      <div className="relative">
        {/* Back button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 left-4 z-10 rounded-full bg-black/50"
          onClick={() => router.push(`/details/${showId}`)}
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="sr-only">Back to show</span>
        </Button>

        {/* Video player */}
        <VideoPlayer
          src={episode.videoUrl}
          poster={episode.stillImage}
          title={episodeTitle}
          videoId={episode.id}
          // For demonstration purposes, we're estimating credits start 30 seconds before the end
          creditsStartTime={episode.runtime ? episode.runtime * 60 - 30 : undefined}
          onNext={
            nextEpisode
              ? () => navigateToEpisode(showId, nextEpisode.seasonNumber, nextEpisode.episodeNumber)
              : undefined
          }
          onPrevious={
            previousEpisode
              ? () => navigateToEpisode(showId, previousEpisode.seasonNumber, previousEpisode.episodeNumber)
              : undefined
          }
          autoplay={true} // Enable autoplay for episodes
          nextEpisodeData={nextEpisodeData} // Pass next episode data for seamless transition
          onEpisodeChange={handleEpisodeChange} // Handle episode change during seamless transition
          // Add tooltip information
          previousEpisodeInfo={
            previousEpisode
              ? {
                  title: previousEpisode.title,
                  thumbnail: previousEpisode.stillImage,
                  episodeNumber: previousEpisode.episodeNumber,
                  seasonNumber: previousEpisode.seasonNumber,
                }
              : undefined
          }
          nextEpisodeInfo={
            nextEpisode
              ? {
                  title: nextEpisode.title,
                  thumbnail: nextEpisode.stillImage,
                  episodeNumber: nextEpisode.episodeNumber,
                  seasonNumber: nextEpisode.seasonNumber,
                }
              : undefined
          }
        />
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold">{episode.title}</h1>
            <p className="text-gray-400">
              <Link href={`/details/${showId}`}>{show.title}</Link> • Season {seasonNumber}, Episode {episodeNumber}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {previousEpisode && (
              <Button
                variant="outline"
                onClick={() => navigateToEpisode(showId, previousEpisode.seasonNumber, previousEpisode.episodeNumber)}
                className="flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous episode
              </Button>
            )}

            {nextEpisode && (
              <Button
                variant="outline"
                onClick={() => navigateToEpisode(showId, nextEpisode.seasonNumber, nextEpisode.episodeNumber)}
                className="flex items-center gap-1"
              >
                Next episode
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="mb-8">
          <p className="text-gray-300">{episode.description}</p>
          {episode.airDate && (
            <p className="text-sm text-gray-400 mt-2">Air date: {new Date(episode.airDate).toLocaleDateString()}</p>
          )}
        </div>

        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold">Episodes</h2>
              {availableSeasons.length > 0 && (
                <SeasonSelector
                  seasons={availableSeasons}
                  currentSeason={selectedSeasonNumber}
                  onSeasonChange={handleSeasonChange}
                />
              )}
            </div>
            <Button
              variant="outline"
              onClick={() => setShowEpisodeList(!showEpisodeList)}
              className="flex items-center gap-1"
            >
              <ListVideo className="w-4 h-4" />
              {showEpisodeList ? "Hide episodes" : "Show episodes"}
            </Button>
          </div>
          {showEpisodeList && (
            <div className="bg-gray-900/30 border border-gray-800 rounded-lg p-4">
              {isLoadingSeasonEpisodes ? (
                <div className="flex justify-center py-8">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : seasonEpisodes.length > 0 ? (
                <EpisodeList
                  episodes={seasonEpisodes}
                  showId={showId}
                  seasonNumber={selectedSeasonNumber}
                  watchedEpisodes={watchedEpisodes}
                  currentEpisodeNumber={selectedSeasonNumber === seasonNumber ? episodeNumber : undefined}
                />
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400">No episodes available for this season.</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-between items-center">
          <Button asChild variant="outline">
            <Link href={`/tv-show/${showId}/seasons`}>View all seasons</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

console.log('hey');