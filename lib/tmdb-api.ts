// TMDB API client for fetching movie and TV show data
// Documentation: https://developer.themoviedb.org/reference/intro/getting-started

// API configuration
// Use the provided API key as a fallback if the environment variable is not set
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || "1375c768e61536be409ee6ade2f504b5"
const TMDB_BASE_URL = "https://api.themoviedb.org/3"
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p"

// Log API key status (without revealing the actual key)
console.log("TMDB API Key status:", TMDB_API_KEY ? "Available" : "Not available")
console.log("Using environment variable:", !!process.env.NEXT_PUBLIC_TMDB_API_KEY)
console.log("Using fallback API key:", !process.env.NEXT_PUBLIC_TMDB_API_KEY && !!TMDB_API_KEY)

// Image sizes
export const POSTER_SIZES = {
  small: "w185",
  medium: "w342",
  large: "w500",
  original: "original",
}

export const BACKDROP_SIZES = {
  small: "w300",
  medium: "w780",
  large: "w1280",
  original: "original",
}

export const PROFILE_SIZES = {
  small: "w45",
  medium: "w185",
  large: "h632",
  original: "original",
}

// Helper function to construct image URLs
export function getImageUrl(path: string | null, size: string = POSTER_SIZES.medium): string {
  if (!path) {
    return `/placeholder.svg?height=400&width=300`
  }
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`
}

// Cache for API responses
const apiCache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 15 * 60 * 1000 // 15 minutes in milliseconds

// Helper function to make API requests with caching
async function fetchWithCache(endpoint: string, params: Record<string, string> = {}): Promise<any> {
  // Construct the full URL with API key
  const queryParams = new URLSearchParams({
    api_key: TMDB_API_KEY,
    ...params,
  })

  const url = `${TMDB_BASE_URL}${endpoint}?${queryParams.toString()}`
  const maskedUrl = url.replace(TMDB_API_KEY, "API_KEY_HIDDEN")

  // Check if we have a cached response
  const cacheKey = url
  const cachedResponse = apiCache.get(cacheKey)

  if (cachedResponse && Date.now() - cachedResponse.timestamp < CACHE_DURATION) {
    console.log(`Using cached data for: ${endpoint}`)
    return cachedResponse.data
  }

  // If no cache or cache expired, make the API request
  console.log(`Fetching from API: ${maskedUrl}`)

  try {
    const response = await fetch(url)

    if (!response.ok) {
      const errorData = await response.json()
      console.error(`API request failed with status ${response.status}:`, errorData)
      throw new Error(errorData.status_message || `API request failed with status ${response.status}`)
    }

    const data = await response.json()
    console.log(`Successfully fetched data from ${endpoint}`)

    // Cache the response
    apiCache.set(cacheKey, { data, timestamp: Date.now() })

    return data
  } catch (error) {
    console.error(`Error fetching from TMDB API: ${endpoint}`, error)
    throw error
  }
}

// Function to clear the cache (useful for testing or when user logs out)
export function clearApiCache(): void {
  apiCache.clear()
}

// API Functions

// Search for movies and TV shows
export async function searchMulti(query: string, page = 1): Promise<any> {
  return fetchWithCache("/search/multi", { query, page: page.toString() })
}

// Get trending content
export async function getTrending(timeWindow: "day" | "week" = "week", page = 1): Promise<any> {
  return fetchWithCache(`/trending/all/${timeWindow}`, { page: page.toString() })
}

// Get popular movies
export async function getPopularMovies(page = 1): Promise<any> {
  return fetchWithCache("/movie/popular", { page: page.toString() })
}

// Get popular TV shows
export async function getPopularTVShows(page = 1): Promise<any> {
  return fetchWithCache("/tv/popular", { page: page.toString() })
}

// Get movie details
export async function getMovieDetails(movieId: string): Promise<any> {
  return fetchWithCache(`/movie/${movieId}`, { append_to_response: "credits,videos,reviews,similar" })
}

// Get TV show details
export async function getTVShowDetails(tvId: string): Promise<any> {
  return fetchWithCache(`/tv/${tvId}`, { append_to_response: "credits,videos,reviews,similar,seasons" })
}

// Get movie recommendations
export async function getMovieRecommendations(movieId: string, page = 1): Promise<any> {
  return fetchWithCache(`/movie/${movieId}/recommendations`, { page: page.toString() })
}

// Get TV show recommendations
export async function getTVShowRecommendations(tvId: string, page = 1): Promise<any> {
  return fetchWithCache(`/tv/${tvId}/recommendations`, { page: page.toString() })
}

// Get now playing movies
export async function getNowPlayingMovies(page = 1): Promise<any> {
  return fetchWithCache("/movie/now_playing", { page: page.toString() })
}

// Get upcoming movies
export async function getUpcomingMovies(page = 1): Promise<any> {
  return fetchWithCache("/movie/upcoming", { page: page.toString() })
}

// Get top rated movies
export async function getTopRatedMovies(page = 1): Promise<any> {
  return fetchWithCache("/movie/top_rated", { page: page.toString() })
}

// Get top rated TV shows
export async function getTopRatedTVShows(page = 1): Promise<any> {
  return fetchWithCache("/tv/top_rated", { page: page.toString() })
}

// Get TV shows airing today
export async function getTVShowsAiringToday(page = 1): Promise<any> {
  return fetchWithCache("/tv/airing_today", { page: page.toString() })
}

// Get TV shows on the air
export async function getTVShowsOnTheAir(page = 1): Promise<any> {
  return fetchWithCache("/tv/on_the_air", { page: page.toString() })
}

// Get movie genres
export async function getMovieGenres(): Promise<any> {
  return fetchWithCache("/genre/movie/list")
}

// Get TV show genres
export async function getTVShowGenres(): Promise<any> {
  return fetchWithCache("/genre/tv/list")
}

// Discover movies by genre
export async function discoverMoviesByGenre(genreId: string, page = 1): Promise<any> {
  return fetchWithCache("/discover/movie", {
    with_genres: genreId,
    page: page.toString(),
    sort_by: "popularity.desc",
  })
}

// Discover TV shows by genre
export async function discoverTVShowsByGenre(genreId: string, page = 1): Promise<any> {
  return fetchWithCache("/discover/tv", {
    with_genres: genreId,
    page: page.toString(),
    sort_by: "popularity.desc",
  })
}

// Get movie videos (trailers, teasers, etc.)
export async function getMovieVideos(movieId: string): Promise<any> {
  return fetchWithCache(`/movie/${movieId}/videos`)
}

// Get TV show videos
export async function getTVShowVideos(tvId: string): Promise<any> {
  return fetchWithCache(`/tv/${tvId}/videos`)
}

// Get movie credits (cast and crew)
export async function getMovieCredits(movieId: string): Promise<any> {
  return fetchWithCache(`/movie/${movieId}/credits`)
}

// Get TV show credits
export async function getTVShowCredits(tvId: string): Promise<any> {
  return fetchWithCache(`/tv/${tvId}/credits`)
}

// Get person details
export async function getPersonDetails(personId: string): Promise<any> {
  return fetchWithCache(`/person/${personId}`, { append_to_response: "movie_credits,tv_credits,images" })
}

// Get TV show season details
export async function getTVShowSeason(tvId: string, seasonNumber: number): Promise<any> {
  return fetchWithCache(`/tv/${tvId}/season/${seasonNumber}`)
}

// Get TV show episode details
export async function getTVShowEpisode(tvId: string, seasonNumber: number, episodeNumber: number): Promise<any> {
  return fetchWithCache(`/tv/${tvId}/season/${seasonNumber}/episode/${episodeNumber}`)
}

// Get TV show episode videos (for trailers or clips)
export async function getTVShowEpisodeVideos(tvId: string, seasonNumber: number, episodeNumber: number): Promise<any> {
  return fetchWithCache(`/tv/${tvId}/season/${seasonNumber}/episode/${episodeNumber}/videos`)
}

// Get TV show episode images
export async function getTVShowEpisodeImages(tvId: string, seasonNumber: number, episodeNumber: number): Promise<any> {
  return fetchWithCache(`/tv/${tvId}/season/${seasonNumber}/episode/${episodeNumber}/images`)
}
