// This is a client-side service to track watch progress
// In a real app, this would be connected to a backend API

// Types
interface WatchProgress {
  id: string
  position: number // in seconds
  duration: number // in seconds
  percent: number // 0-100
  completed: boolean
  lastWatched: string // ISO date string
}

// Local storage keys
const WATCH_HISTORY_KEY = "streamflix_watch_history"
const WATCHED_EPISODES_KEY = "streamflix_watched_episodes"

// Get all watch history
export function getWatchHistory(): WatchProgress[] {
  if (typeof window === "undefined") return []

  try {
    const history = localStorage.getItem(WATCH_HISTORY_KEY)
    return history ? JSON.parse(history) : []
  } catch (error) {
    console.error("Failed to get watch history:", error)
    return []
  }
}

// Get progress for a specific video
export function getVideoProgress(videoId: string): WatchProgress | null {
  const history = getWatchHistory()
  return history.find((item) => item.id === videoId) || null
}

// Update progress for a video
export function updateVideoProgress(videoId: string, position: number, duration: number): void {
  if (typeof window === "undefined") return

  try {
    const history = getWatchHistory()
    const percent = Math.round((position / duration) * 100)
    const completed = percent > 90 // Consider completed if watched more than 90%

    // Find existing entry or create new one
    const existingIndex = history.findIndex((item) => item.id === videoId)
    const progressData: WatchProgress = {
      id: videoId,
      position,
      duration,
      percent,
      completed,
      lastWatched: new Date().toISOString(),
    }

    if (existingIndex >= 0) {
      history[existingIndex] = progressData
    } else {
      history.push(progressData)
    }

    // Sort by last watched (most recent first)
    history.sort((a, b) => new Date(b.lastWatched).getTime() - new Date(a.lastWatched).getTime())

    // Limit history to 100 items
    const limitedHistory = history.slice(0, 100)

    localStorage.setItem(WATCH_HISTORY_KEY, JSON.stringify(limitedHistory))

    // If completed, add to watched episodes list
    if (completed && videoId.startsWith("episode-")) {
      markEpisodeAsWatched(videoId)
    }
  } catch (error) {
    console.error("Failed to update watch progress:", error)
  }
}

// Get all watched episodes
export function getWatchedEpisodes(): string[] {
  if (typeof window === "undefined") return []

  try {
    const watched = localStorage.getItem(WATCHED_EPISODES_KEY)
    return watched ? JSON.parse(watched) : []
  } catch (error) {
    console.error("Failed to get watched episodes:", error)
    return []
  }
}

// Mark an episode as watched
export function markEpisodeAsWatched(episodeId: string): void {
  if (typeof window === "undefined") return

  try {
    const watched = getWatchedEpisodes()
    if (!watched.includes(episodeId)) {
      watched.push(episodeId)
      localStorage.setItem(WATCHED_EPISODES_KEY, JSON.stringify(watched))
    }
  } catch (error) {
    console.error("Failed to mark episode as watched:", error)
  }
}

// Mark an episode as unwatched
export function markEpisodeAsUnwatched(episodeId: string): void {
  if (typeof window === "undefined") return

  try {
    let watched = getWatchedEpisodes()
    watched = watched.filter((id) => id !== episodeId)
    localStorage.setItem(WATCHED_EPISODES_KEY, JSON.stringify(watched))

    // Also remove from watch history
    const history = getWatchHistory()
    const updatedHistory = history.filter((item) => item.id !== episodeId)
    localStorage.setItem(WATCH_HISTORY_KEY, JSON.stringify(updatedHistory))
  } catch (error) {
    console.error("Failed to mark episode as unwatched:", error)
  }
}

// Get watched episodes for a specific show
export function getWatchedEpisodesForShow(showId: string): string[] {
  const watched = getWatchedEpisodes()
  return watched.filter((id) => id.includes(`-${showId}-`))
}

// Calculate show progress (what percentage of episodes have been watched)
export function calculateShowProgress(showId: string, totalEpisodes: number): number {
  const watchedEpisodes = getWatchedEpisodesForShow(showId)
  if (totalEpisodes === 0) return 0
  return Math.round((watchedEpisodes.length / totalEpisodes) * 100)
}
