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

// Get trending content
export async function getTrendingContent(page = 1): Promise<any[]> {
  try {
    const data = await tmdbApi.getTrending("week", page)
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
    throw new ContentError("Failed to fetch trending content. Please try again later.")
  }
}

// Get popular movies
export async function getPopularMovies(page = 1): Promise<any[]> {
  try {
    const data = await tmdbApi.getPopularMovies(page)
    return data.results.map(tmdbAdapter.adaptMovie)
  } catch (error) {
    console.error("Error fetching popular movies:", error)
    throw new ContentError("Failed to fetch popular movies. Please try again later.")
  }
}

// Get popular TV shows
export async function getPopularTVShows(page = 1): Promise<any[]> {
  try {
    const data = await tmdbApi.getPopularTVShows(page)
    return data.results.map(tmdbAdapter.adaptTVShow)
  } catch (error) {
    console.error("Error fetching popular TV shows:", error)
    throw new ContentError("Failed to fetch popular TV shows. Please try again later.")
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
    if (error instanceof ContentError) {
      throw error
    }
    throw new ContentError(`Failed to fetch details for content with ID ${id}. Please try again later.`)
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
    throw new ContentError("Failed to search content. Please try again later.")
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
    throw new ContentError("Failed to fetch new releases. Please try again later.")
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
