"use client"

import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { CheckCircle, Circle, Play } from "lucide-react"
import { getVideoProgress } from "@/lib/progress-service"
import { cn } from "@/lib/utils"

interface EpisodeListProps {
  episodes: any[]
  showId: string
  seasonNumber: number
  watchedEpisodes: string[]
  currentEpisodeNumber?: number
}

export const EpisodeList: React.FC<EpisodeListProps> = ({
  episodes,
  showId,
  seasonNumber,
  watchedEpisodes,
  currentEpisodeNumber,
}) => {
  const getEpisodeProgress = (episodeId: string) => {
    const progress = getVideoProgress(episodeId)
    return progress ? progress.percent : 0
  }

  return (
    <div className="flex flex-col gap-y-4">
      {episodes.map((episode) => {
        const episodeId = `episode-${showId}-${seasonNumber}-${episode.episodeNumber}`
        const isWatched = watchedEpisodes.includes(episodeId)
        const isCurrent = currentEpisodeNumber === episode.episodeNumber

        return (
          <Link
            href={`/watch/episode/${showId}/${seasonNumber}/${episode.episodeNumber}`}
            key={episode.id || episodeId}
          >
            <div
              className={cn(
                "flex items-center gap-x-4 border rounded-md p-4 hover:bg-secondary/50 transition-all",
                isCurrent && "bg-secondary border-primary",
              )}
            >
              <div className="relative w-24 h-16">
                <Image
                  src={episode.stillImage || "/placeholder.svg"}
                  alt={episode.title}
                  fill
                  className="object-cover rounded-md"
                />
                {!isWatched && getEpisodeProgress(episodeId) > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                    <div className="h-full bg-primary" style={{ width: `${getEpisodeProgress(episodeId)}%` }} />
                  </div>
                )}
                {isCurrent && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-md">
                    <Play className="w-8 h-8 text-primary fill-primary" />
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className={cn("text-sm font-medium", isCurrent && "text-primary")}>
                    {episode.episodeNumber}. {episode.title}
                  </h3>
                  {isWatched ? (
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  ) : (
                    <Circle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{episode.description}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {episode.runtime ? `${episode.runtime} min` : ""}
                  {episode.airDate && (episode.runtime ? " • " : "") + new Date(episode.airDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
