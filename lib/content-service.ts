import * as tmdbApi from "./tmdb-api"
import * as tmdbAdapter from "./tmdb-adapter"

// Error class for content-related errors
export class ContentError extends Error {
  constructor(
    message: string,
    public code?: string,
  ) {
    super(message)
    this.name = "ContentError"
  }
}

// Update the error handling in getTrendingContent to log more details
export async function getTrendingContent(page = 1): Promise<any[]> {
  try {
    console.log("Fetching trending content with TMDB API...")
    const data = await tmdbApi.getTrending("week", page)
    console.log("Successfully fetched trending content:", data.results.length, "items")
    return data.results
      .filter((item: any) => item.media_type === "movie" || item.media_type === "tv")
      .map((item: any) => {
        if (item.media_type === "movie") {
          return tmdbAdapter.adaptMovie(item)
        } else {
          return tmdbAdapter.adaptTVShow(item)
        }
      })
  } catch (error) {
    console.error("Error fetching trending content:", error)
    console.log("Falling back to mock data...")
    // Fallback to mock data on error
    const { getTrendingContent: getMockTrendingContent } = await import("./api")
    return getMockTrendingContent(20)
  }
}

// Update the error handling in getPopularMovies to log more details
export async function getPopularMovies(page = 1): Promise<any[]> {
  try {
    console.log("Fetching popular movies with TMDB API...")
    const data = await tmdbApi.getPopularMovies(page)
    console.log("Successfully fetched popular movies:", data.results.length, "items")
    return data.results.map(tmdbAdapter.adaptMovie)
  } catch (error) {
    console.error("Error fetching popular movies:", error)
    console.log("Falling back to mock data...")
    // Fallback to mock data on error
    const { getMovies } = await import("./api")
    return getMovies()
  }
}

// Update the error handling in getPopularTVShows to log more details
export async function getPopularTVShows(page = 1): Promise<any[]> {
  try {
    console.log("Fetching popular TV shows with TMDB API...")
    const data = await tmdbApi.getPopularTVShows(page)
    console.log("Successfully fetched popular TV shows:", data.results.length, "items")
    return data.results.map(tmdbAdapter.adaptTVShow)
  } catch (error) {
    console.error("Error fetching popular TV shows:", error)
    console.log("Falling back to mock data...")
    // Fallback to mock data on error
    const { getTVShows } = await import("./api")
    return getTVShows()
  }
}

// Get content details by ID
export async function getContentDetails(id: string): Promise<any> {
  try {
    // Parse the ID to determine if it's a movie or TV show
    const [type, tmdbId] = id.split("-")

    if (!tmdbId) {
      // If the ID doesn't have the expected format, try to determine the type
      // This is for backward compatibility with our mock data
      const movieDetails = await tmdbApi.getMovieDetails(id).catch(() => null)
      if (movieDetails) {
        return tmdbAdapter.adaptMovieDetails(movieDetails)
      }

      const tvDetails = await tmdbApi.getTVShowDetails(id).catch(() => null)
      if (tvDetails) {
        return tmdbAdapter.adaptTVShowDetails(tvDetails)
      }

      throw new ContentError(`Content with ID ${id} not found`, "NOT_FOUND")
    }

    if (type === "movie") {
      const movieDetails = await tmdbApi.getMovieDetails(tmdbId)
      return tmdbAdapter.adaptMovieDetails(movieDetails)
    } else if (type === "tv") {
      const tvDetails = await tmdbApi.getTVShowDetails(tmdbId)
      return tmdbAdapter.adaptTVShowDetails(tvDetails)
    } else {
      throw new ContentError(`Invalid content type: ${type}`, "INVALID_TYPE")
    }
  } catch (error) {
    console.error(`Error fetching content details for ID ${id}:`, error)
    // Fallback to mock data on error
    try {
      const { getVideoDetails } = await import("./api")
      return getVideoDetails(id)
    } catch (fallbackError) {
      if (error instanceof ContentError) {
        throw error
      }
      throw new ContentError(`Failed to fetch details for content with ID ${id}. Please try again later.`)
    }
  }
}

// Search for content
export async function searchContent(query: string, page = 1): Promise<any[]> {
  if (!query.trim()) {
    return []
  }

  try {
    const data = await tmdbApi.searchMulti(query, page)
    return tmdbAdapter.adaptSearchResults(data)
  } catch (error) {
    console.error("Error searching content:", error)
    // Fallback to mock data on error
    const { searchVideos } = await import("./api")
    return searchVideos(query)
  }
}

// Get new releases (combining now playing and upcoming movies, and TV shows airing today)
export async function getNewReleases(page = 1): Promise<any[]> {
  try {
    const [nowPlaying, upcoming, airingToday] = await Promise.all([
      tmdbApi.getNowPlayingMovies(page),
      tmdbApi.getUpcomingMovies(page),
      tmdbApi.getTVShowsAiringToday(page),
    ])

    // Combine and sort by release date (newest first)
    const movies = [...nowPlaying.results, ...upcoming.results].map(tmdbAdapter.adaptMovie).filter(
      (movie, index, self) =>
        // Remove duplicates
        index === self.findIndex((m) => m.tmdbId === movie.tmdbId),
    )

    const tvShows = airingToday.results.map(tmdbAdapter.adaptTVShow)

    return [...movies, ...tvShows]
      .sort((a, b) => {
        const dateA = a.releaseDate ? new Date(a.releaseDate).getTime() : 0
        const dateB = b.releaseDate ? new Date(b.releaseDate).getTime() : 0
        return dateB - dateA
      })
      .slice(0, 20) // Limit to 20 items
  } catch (error) {
    console.error("Error fetching new releases:", error)
    // Fallback to mock data on error
    const { getNewReleases: getMockNewReleases } = await import("./api")
    return getMockNewReleases(20)
  }
}

// Get movies by genre
export async function getMoviesByGenre(genreId: string, page = 1): Promise<any[]> {
  try {
    const data = await tmdbApi.discoverMoviesByGenre(genreId, page)
    return data.results.map(tmdbAdapter.adaptMovie)
  } catch (error) {
    console.error(`Error fetching movies by genre ${genreId}:`, error)
    throw new ContentError("Failed to fetch movies by genre. Please try again later.")
  }
}

// Get TV shows by genre
export async function getTVShowsByGenre(genreId: string, page = 1): Promise<any[]> {
  try {
    const data = await tmdbApi.discoverTVShowsByGenre(genreId, page)
    return data.results.map(tmdbAdapter.adaptTVShow)
  } catch (error) {
    console.error(`Error fetching TV shows by genre ${genreId}:`, error)
    throw new ContentError("Failed to fetch TV shows by genre. Please try again later.")
  }
}

// Get movie and TV show genres
export async function getAllGenres(): Promise<any[]> {
  try {
    const [movieGenres, tvGenres] = await Promise.all([tmdbApi.getMovieGenres(), tmdbApi.getTVShowGenres()])

    // Combine genres and remove duplicates
    const allGenres = [...movieGenres.genres, ...tvGenres.genres]
    const uniqueGenres = Array.from(new Map(allGenres.map((genre) => [genre.id, genre])).values())

    return uniqueGenres
  } catch (error) {
    console.error("Error fetching genres:", error)
    throw new ContentError("Failed to fetch genres. Please try again later.")
  }
}

// Get similar content recommendations
export async function getSimilarContent(id: string, page = 1): Promise<any[]> {
  try {
    const [type, tmdbId] = id.split("-")

    if (type === "movie") {
      const data = await tmdbApi.getMovieRecommendations(tmdbId, page)
      return data.results.map(tmdbAdapter.adaptMovie)
    } else if (type === "tv") {
      const data = await tmdbApi.getTVShowRecommendations(tmdbId, page)
      return data.results.map(tmdbAdapter.adaptTVShow)
    } else {
      throw new ContentError(`Invalid content type: ${type}`, "INVALID_TYPE")
    }
  } catch (error) {
    console.error(`Error fetching similar content for ID ${id}:`, error)
    if (error instanceof ContentError) {
      throw error
    }
    throw new ContentError("Failed to fetch similar content. Please try again later.")
  }
}

// Get TV show seasons
export async function getTVShowSeasons(showId: string): Promise<any[]> {
  try {
    // Extract the TMDB ID from our internal ID format
    const [type, tmdbId] = showId.split("-")

    if (type !== "tv") {
      throw new ContentError(`Invalid show ID: ${showId}. Expected a TV show ID.`, "INVALID_TYPE")
    }

    // Get the TV show details which includes basic season information
    const tvDetails = await tmdbApi.getTVShowDetails(tmdbId)

    // Map the seasons to our format
    return tvDetails.seasons.map((season: any) => tmdbAdapter.adaptTVShowSeason(season, showId))
  } catch (error) {
    console.error(`Error fetching seasons for show ID ${showId}:`, error)
    // Fallback to mock data or empty array
    return []
  }
}

// Get TV show season details with episodes
export async function getTVShowSeason(showId: string, seasonNumber: number): Promise<any> {
  try {
    // Extract the TMDB ID from our internal ID format
    const [type, tmdbId] = showId.split("-")

    if (type !== "tv") {
      throw new ContentError(`Invalid show ID: ${showId}. Expected a TV show ID.`, "INVALID_TYPE")
    }

    // Get the season details including episodes
    const seasonDetails = await tmdbApi.getTVShowSeason(tmdbId, seasonNumber)

    // Adapt the season data to our format
    return tmdbAdapter.adaptTVShowSeason(seasonDetails, showId)
  } catch (error) {
    console.error(`Error fetching season ${seasonNumber} for show ID ${showId}:`, error)
    throw new ContentError(`Failed to fetch season ${seasonNumber} details. Please try again later.`)
  }
}

// Get TV show episode details
export async function getTVShowEpisode(showId: string, seasonNumber: number, episodeNumber: number): Promise<any> {
  try {
    // Extract the TMDB ID from our internal ID format
    const [type, tmdbId] = showId.split("-")

    if (type !== "tv") {
      throw new ContentError(`Invalid show ID: ${showId}. Expected a TV show ID.`, "INVALID_TYPE")
    }

    // Get the episode details
    const episodeDetails = await tmdbApi.getTVShowEpisode(tmdbId, seasonNumber, episodeNumber)

    // Adapt the episode data to our format
    return tmdbAdapter.adaptTVShowEpisode(episodeDetails, showId, seasonNumber)
  } catch (error) {
    console.error(`Error fetching episode ${episodeNumber} of season ${seasonNumber} for show ID ${showId}:`, error)
    throw new ContentError(`Failed to fetch episode details. Please try again later.`)
  }
}

// Get next episode
export async function getNextEpisode(showId: string, seasonNumber: number, episodeNumber: number): Promise<any> {
  try {
    // Get the season details to know how many episodes it has
    const season = await getTVShowSeason(showId, seasonNumber)

    // If there are more episodes in the current season
    if (episodeNumber < season.episodeCount) {
      return getTVShowEpisode(showId, seasonNumber, episodeNumber + 1)
    }

    // Otherwise, try to get the first episode of the next season
    const [type, tmdbId] = showId.split("-")
    const tvDetails = await tmdbApi.getTVShowDetails(tmdbId)
    const seasons = tvDetails.seasons.filter((s: any) => s.season_number > 0) // Filter out specials (season 0)

    const currentSeasonIndex = seasons.findIndex((s: any) => s.season_number === seasonNumber)
    if (currentSeasonIndex < seasons.length - 1) {
      const nextSeason = seasons[currentSeasonIndex + 1]
      return getTVShowEpisode(showId, nextSeason.season_number, 1)
    }

    // No next episode available
    return null
  } catch (error) {
    console.error(`Error fetching next episode after S${seasonNumber}E${episodeNumber} for show ID ${showId}:`, error)
    return null
  }
}

// Get previous episode
export async function getPreviousEpisode(showId: string, seasonNumber: number, episodeNumber: number): Promise<any> {
  try {
    // If not the first episode of the season
    if (episodeNumber > 1) {
      return getTVShowEpisode(showId, seasonNumber, episodeNumber - 1)
    }

    // If first episode of a season (not the first season)
    if (seasonNumber > 1) {
      // Get the previous season to know how many episodes it has
      const previousSeason = await getTVShowSeason(showId, seasonNumber - 1)
      return getTVShowEpisode(showId, seasonNumber - 1, previousSeason.episodeCount)
    }

    // No previous episode available
    return null
  } catch (error) {
    console.error(
      `Error fetching previous episode before S${seasonNumber}E${episodeNumber} for show ID ${showId}:`,
      error,
    )
    return null
  }
}
