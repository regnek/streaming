"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, ChevronRight, ListVideo, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { VideoPlayer } from "@/components/video-player"
import { EpisodeList } from "@/components/episode-list"
import {
  getContentDetails,
  getTVShowSeason,
  getTVShowEpisode,
  getNextEpisode,
  getPreviousEpisode,
} from "@/lib/content-service"
import { getWatchedEpisodes } from "@/lib/progress-service"

export default function EpisodeWatchPage() {
  const params = useParams()
  const router = useRouter()

  const showId = params.showId as string
  const seasonNumber = Number.parseInt(params.seasonNumber as string, 10)
  const episodeNumber = Number.parseInt(params.episodeNumber as string, 10)

  const [show, setShow] = useState<any>(null)
  const [episode, setEpisode] = useState<any>(null)
  const [seasonEpisodes, setSeasonEpisodes] = useState<any[]>([])
  const [nextEpisode, setNextEpisode] = useState<any>(null)
  const [previousEpisode, setPreviousEpisode] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [showEpisodeList, setShowEpisodeList] = useState(true)
  const [watchedEpisodes, setWatchedEpisodes] = useState<string[]>([])

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError("")

      try {
        // Fetch show details
        const showDetails = await getContentDetails(showId)
        setShow(showDetails)

        // Fetch current episode
        const episodeDetails = await getTVShowEpisode(showId, seasonNumber, episodeNumber)
        setEpisode(episodeDetails)

        // Fetch all episodes for the season
        const seasonDetails = await getTVShowSeason(showId, seasonNumber)
        setSeasonEpisodes(seasonDetails.episodes || [])

        // Fetch next and previous episodes
        const next = await getNextEpisode(showId, seasonNumber, episodeNumber).catch(() => null)
        const prev = await getPreviousEpisode(showId, seasonNumber, episodeNumber).catch(() => null)

        setNextEpisode(next)
        setPreviousEpisode(prev)

        // Get watched episodes
        const watched = getWatchedEpisodes()
        setWatchedEpisodes(watched)
      } catch (err) {
        console.error("Failed to fetch episode data:", err)
        setError("Failed to load episode. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [showId, seasonNumber, episodeNumber])

  const navigateToEpisode = (targetShowId: string, targetSeasonNumber: number, targetEpisodeNumber: number) => {
    router.push(`/watch/episode/${targetShowId}/${targetSeasonNumber}/${targetEpisodeNumber}`)
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
        <VideoPlayer src={episode.videoUrl} poster={episode.stillImage} title={episodeTitle} videoId={episode.id} />
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
              <h2 className="text-xl font-semibold mb-4">Season {seasonNumber} episodes</h2>
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
                <EpisodeList
                  episodes={seasonEpisodes}
                  showId={showId}
                  seasonNumber={seasonNumber}
                  watchedEpisodes={watchedEpisodes}
                  currentEpisodeNumber={episodeNumber}
                />
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
