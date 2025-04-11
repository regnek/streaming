"use client"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface SeasonSelectorProps {
  seasons: {
    seasonNumber: number
    name: string
    episodeCount: number
  }[]
  currentSeason: number
  onSeasonChange: (seasonNumber: number) => void
}

export function SeasonSelector({ seasons, currentSeason, onSeasonChange }: SeasonSelectorProps) {
  const currentSeasonData = seasons.find((s) => s.seasonNumber === currentSeason) || seasons[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          {currentSeasonData?.name || `Season ${currentSeason}`}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {seasons.map((season) => (
          <DropdownMenuItem
            key={season.seasonNumber}
            className={currentSeason === season.seasonNumber ? "bg-accent" : ""}
            onClick={() => onSeasonChange(season.seasonNumber)}
          >
            <div className="flex flex-col">
              <span>{season.name}</span>
              <span className="text-xs text-gray-400">{season.episodeCount} episodes</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
