const API_KEY = "2dca580c2a14b55200e784d157207b4d"

export const MOVIES_API = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc&page=1&vote_count.gte=100`;
export const GENRES_API = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en`
export const SEARCH_API = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}`
export const IMAGE_URL = "https://image.tmdb.org/t/p/w500/";
export const PRIMARY_COLOR = "#F0283C"