import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  if (!dateString) return "TBA"

  const date = new Date(dateString)
  if (isNaN(date.getTime())) return "Invalid Date"

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function formatDuration(minutes: number): string {
  if (!minutes) return ""

  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60

  if (hours > 0) {
    return `${hours}h ${mins > 0 ? `${mins}m` : ""}`
  }

  return `${mins}m`
}

export function formatEpisodeNumber(season: number, episode: number): string {
  return `S${season.toString().padStart(2, "0")}E${episode.toString().padStart(2, "0")}`
}
