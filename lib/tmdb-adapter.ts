import { getImageUrl, POSTER_SIZES, BACKDROP_SIZES, PROFILE_SIZES } from "./tmdb-api"

// Convert TMDB movie to our app's format
export function adaptMovie(tmdbMovie: any): any {
  return {
    id: `movie-${tmdbMovie.id}`,
    tmdbId: tmdbMovie.id,
    title: tmdbMovie.title,
    description: tmdbMovie.overview,
    thumbnail: getImageUrl(tmdbMovie.backdrop_path, BACKDROP_SIZES.medium),
    poster: getImageUrl(tmdbMovie.poster_path, POSTER_SIZES.large),
    videoUrl: "", // TMDB doesn't provide actual video streams
    trailerUrl: "", // We'll set this separately from videos data
    category: "movie",
    releaseYear: tmdbMovie.release_date ? tmdbMovie.release_date.substring(0, 4) : "",
    releaseDate: tmdbMovie.release_date
      ? new Date(tmdbMovie.release_date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "",
    duration: tmdbMovie.runtime ? `${Math.floor(tmdbMovie.runtime / 60)}h ${tmdbMovie.runtime % 60}m` : "",
    rating: tmdbMovie.adult ? "R" : "PG-13", // Simplified; real data would be more accurate
    genres: tmdbMovie.genres ? tmdbMovie.genres.map((g) => g.name) : tmdbMovie.genre_ids ? [] : [], // We'll populate this from genre IDs if needed
    popularity: Math.round(tmdbMovie.vote_average * 10),
    trending: tmdbMovie.popularity > 100, // Arbitrary threshold
    userRating: tmdbMovie.vote_average,
    voteCount: tmdbMovie.vote_count,
    originalLanguage: tmdbMovie.original_language,
    productionCompanies: tmdbMovie.production_companies
      ? tmdbMovie.production_companies.map((company) => company.name)
      : [],
  }
}

// Convert TMDB TV show to our app's format
export function adaptTVShow(tmdbShow: any): any {
  return {
    id: `tv-${tmdbShow.id}`,
    tmdbId: tmdbShow.id,
    title: tmdbShow.name,
    description: tmdbShow.overview,
    thumbnail: getImageUrl(tmdbShow.backdrop_path, BACKDROP_SIZES.medium),
    poster: getImageUrl(tmdbShow.poster_path, POSTER_SIZES.large),
    videoUrl: "", // TMDB doesn't provide actual video streams
    trailerUrl: "", // We'll set this separately from videos data
    category: "tv-show",
    releaseYear: tmdbShow.first_air_date ? tmdbShow.first_air_date.substring(0, 4) : "",
    releaseDate: tmdbShow.first_air_date
      ? new Date(tmdbShow.first_air_date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "",
    duration: tmdbShow.number_of_seasons
      ? `${tmdbShow.number_of_seasons} Season${tmdbShow.number_of_seasons !== 1 ? "s" : ""}`
      : "",
    rating: tmdbShow.adult ? "TV-MA" : "TV-14", // Simplified; real data would be more accurate
    genres: tmdbShow.genres ? tmdbShow.genres.map((g) => g.name) : tmdbShow.genre_ids ? [] : [], // We'll populate this from genre IDs if needed
    popularity: Math.round(tmdbShow.vote_average * 10),
    trending: tmdbShow.popularity > 100, // Arbitrary threshold
    episodeCount: tmdbShow.number_of_episodes || 0,
    seasonCount: tmdbShow.number_of_seasons || 0,
    userRating: tmdbShow.vote_average,
    voteCount: tmdbShow.vote_count,
    originalLanguage: tmdbShow.original_language,
    networks: tmdbShow.networks ? tmdbShow.networks.map((network) => network.name) : [],
  }
}

// Convert TMDB person to our app's format
export function adaptPerson(tmdbPerson: any): any {
  return {
    id: `person-${tmdbPerson.id}`,
    tmdbId: tmdbPerson.id,
    name: tmdbPerson.name,
    photo: getImageUrl(tmdbPerson.profile_path, PROFILE_SIZES.medium),
    role: tmdbPerson.character || tmdbPerson.job || "",
    department: tmdbPerson.known_for_department || "",
    biography: tmdbPerson.biography || "",
    birthday: tmdbPerson.birthday || "",
    placeOfBirth: tmdbPerson.place_of_birth || "",
  }
}

// Convert TMDB cast to our app's format
export function adaptCast(tmdbCredits: any): any[] {
  if (!tmdbCredits || !tmdbCredits.cast) return []

  return tmdbCredits.cast.slice(0, 10).map((castMember: any) => ({
    name: castMember.name,
    role: castMember.character,
    photo: getImageUrl(castMember.profile_path, PROFILE_SIZES.medium),
    id: `person-${castMember.id}`,
    tmdbId: castMember.id,
  }))
}

// Convert TMDB crew to our app's format (directors, writers, etc.)
export function adaptCrew(tmdbCredits: any): any {
  if (!tmdbCredits || !tmdbCredits.crew) return { directors: [], writers: [], creators: [] }

  const directors = tmdbCredits.crew
    .filter((person: any) => person.job === "Director")
    .map((person: any) => person.name)

  const writers = tmdbCredits.crew
    .filter((person: any) => ["Writer", "Screenplay"].includes(person.job))
    .map((person: any) => person.name)

  // For TV shows, creators are important
  const creators = tmdbCredits.created_by ? tmdbCredits.created_by.map((person: any) => person.name) : []

  return {
    directors,
    writers,
    creators,
  }
}

// Convert TMDB videos to find a trailer
export function findTrailer(tmdbVideos: any): string {
  if (!tmdbVideos || !tmdbVideos.results || !tmdbVideos.results.length) {
    return ""
  }

  // Look for official trailers first
  const trailers = tmdbVideos.results.filter((video: any) => video.type === "Trailer" && video.site === "YouTube")

  if (trailers.length > 0) {
    // Return the most recent trailer
    const trailer = trailers.sort(
      (a: any, b: any) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime(),
    )[0]
    return `https://www.youtube.com/watch?v=${trailer.key}`
  }

  // If no trailers, look for teasers
  const teasers = tmdbVideos.results.filter((video: any) => video.type === "Teaser" && video.site === "YouTube")

  if (teasers.length > 0) {
    return `https://www.youtube.com/watch?v=${teasers[0].key}`
  }

  // If no trailers or teasers, return the first video if it's from YouTube
  const youtubeVideos = tmdbVideos.results.filter((video: any) => video.site === "YouTube")

  if (youtubeVideos.length > 0) {
    return `https://www.youtube.com/watch?v=${youtubeVideos[0].key}`
  }

  return ""
}

// Convert TMDB reviews to our app's format
export function adaptReviews(tmdbReviews: any): any[] {
  if (!tmdbReviews || !tmdbReviews.results) return []

  return tmdbReviews.results.map((review: any) => ({
    id: review.id,
    user: review.author_details.username || review.author,
    rating: review.author_details.rating ? review.author_details.rating / 2 : 0, // Convert to 5-star scale
    comment: review.content,
    date: review.created_at ? new Date(review.created_at).toISOString().split("T")[0] : "",
  }))
}

// Convert TMDB search results to our app's format
export function adaptSearchResults(tmdbResults: any): any[] {
  if (!tmdbResults || !tmdbResults.results) return []

  return tmdbResults.results
    .filter((item: any) => item.media_type === "movie" || item.media_type === "tv")
    .map((item: any) => {
      if (item.media_type === "movie") {
        return adaptMovie(item)
      } else {
        return adaptTVShow(item)
      }
    })
}

// Convert TMDB movie details to our app's format with all related data
export function adaptMovieDetails(tmdbMovie: any): any {
  if (!tmdbMovie) return null

  const movie = adaptMovie(tmdbMovie)

  // Add cast and crew
  if (tmdbMovie.credits) {
    movie.cast = adaptCast(tmdbMovie.credits)
    const crew = adaptCrew(tmdbMovie.credits)
    movie.directors = crew.directors
    movie.writers = crew.writers
  }

  // Add trailer
  if (tmdbMovie.videos) {
    movie.trailerUrl = findTrailer(tmdbMovie.videos)
  }

  // Add reviews
  if (tmdbMovie.reviews) {
    movie.reviews = adaptReviews(tmdbMovie.reviews)
  }

  // Add similar movies
  if (tmdbMovie.similar && tmdbMovie.similar.results) {
    movie.similar = tmdbMovie.similar.results.slice(0, 10).map(adaptMovie)
  }

  return movie
}

// Convert TMDB TV show details to our app's format with all related data
export function adaptTVShowDetails(tmdbShow: any): any {
  if (!tmdbShow) return null

  const show = adaptTVShow(tmdbShow)

  // Add cast and crew
  if (tmdbShow.credits) {
    show.cast = adaptCast(tmdbShow.credits)
    const crew = adaptCrew(tmdbShow.credits)
    show.directors = crew.directors
    show.creators = tmdbShow.created_by ? tmdbShow.created_by.map((person: any) => person.name) : []
  }

  // Add trailer
  if (tmdbShow.videos) {
    show.trailerUrl = findTrailer(tmdbShow.videos)
  }

  // Add reviews
  if (tmdbShow.reviews) {
    show.reviews = adaptReviews(tmdbShow.reviews)
  }

  // Add similar shows
  if (tmdbShow.similar && tmdbShow.similar.results) {
    show.similar = tmdbShow.similar.results.slice(0, 10).map(adaptTVShow)
  }

  // Add seasons information
  if (tmdbShow.seasons) {
    show.seasons = tmdbShow.seasons.map((season: any) => ({
      id: season.id,
      name: season.name,
      overview: season.overview,
      poster: getImageUrl(season.poster_path, POSTER_SIZES.medium),
      seasonNumber: season.season_number,
      episodeCount: season.episode_count,
      airDate: season.air_date,
    }))
  }

  return show
}

// Convert TMDB TV show season to our app's format
export function adaptTVShowSeason(tmdbSeason: any, showId: string): any {
  if (!tmdbSeason) return null

  return {
    id: `season-${showId}-${tmdbSeason.season_number}`,
    tmdbId: tmdbSeason.id,
    showId: showId,
    name: tmdbSeason.name,
    overview: tmdbSeason.overview,
    seasonNumber: tmdbSeason.season_number,
    episodeCount: tmdbSeason.episodes?.length || tmdbSeason.episode_count || 0,
    airDate: tmdbSeason.air_date,
    poster: getImageUrl(tmdbSeason.poster_path, POSTER_SIZES.medium),
    episodes: tmdbSeason.episodes
      ? tmdbSeason.episodes.map((episode: any) => adaptTVShowEpisode(episode, showId, tmdbSeason.season_number))
      : [],
  }
}

// Convert TMDB TV show episode to our app's format
export function adaptTVShowEpisode(tmdbEpisode: any, showId: string, seasonNumber: number): any {
  if (!tmdbEpisode) return null

  return {
    id: `episode-${showId}-${seasonNumber}-${tmdbEpisode.episode_number}`,
    tmdbId: tmdbEpisode.id,
    showId: showId,
    seasonId: `season-${showId}-${seasonNumber}`,
    title: tmdbEpisode.name,
    description: tmdbEpisode.overview,
    seasonNumber: seasonNumber,
    episodeNumber: tmdbEpisode.episode_number,
    airDate: tmdbEpisode.air_date,
    runtime: tmdbEpisode.runtime,
    stillImage: getImageUrl(tmdbEpisode.still_path, BACKDROP_SIZES.large),
    voteAverage: tmdbEpisode.vote_average,
    voteCount: tmdbEpisode.vote_count,
    crew: tmdbEpisode.crew ? tmdbEpisode.crew.map(adaptPerson) : [],
    guestStars: tmdbEpisode.guest_stars ? tmdbEpisode.guest_stars.map(adaptPerson) : [],
    // For demo purposes, we'll use a sample video URL
    videoUrl: "https://moviesandshow.s3.eu-west-2.amazonaws.com/Shows/arrested-development/s1/1-1.mp4",
  }
}
