export type Movie = {
  title: string,
  id: string,
  poster_path: string,
  vote_average: number,
  genre_ids: number[]
}

export type MovieSection = {
  title: number,
  data: [
    { key: number, movies: Movie[] }
  ],
}

export type Genre = {
  name: string,
  id: number,
}

export type SearchParams = {
  refresh?: boolean,
  prevYear?: true,
  nextYear?: true,
  search?: string,
}
