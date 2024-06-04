const API_KEY = "2dca580c2a14b55200e784d157207b4d"

const BASE_URL = "https://api.themoviedb.org/3"

export const MOVIES_API = `${BASE_URL}/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc&page=1&vote_count.gte=100&append_to_response=credits`;
export const GENRES_API = `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en`
export const SEARCH_API = `${BASE_URL}/search/movie?api_key=${API_KEY}`

export const IMAGE_URL = "https://image.tmdb.org/t/p/w500/";
export const PRIMARY_COLOR = "#F0283C"

export const MOVIE_CARD_HEIGHT = 250

export const getMovieDetailsLink = (id: string): string => {
    return `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&append_to_response=credits`;
};