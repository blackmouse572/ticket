export interface Movie {
  poster_path: string;
  adult: boolean;
  overview: string;
  release_date: string;
  genre_ids: number[];
  id: number;
  original_title: string;
  original_language: string;
  title: string;
  backdrop_path: string;
  popularity: number;
  vote_count: number;
  video: boolean;
  vote_average: number;
  revenue?: number;
  runtime?: number;
  status?: "Rumored" | "Planned" | "In Production" | "Post Production" | "Released" | "Canceled";
  tagline?: string;
  genres?: Genre[];
  budget?: number;
  videos: Video[];
}

export interface Video {
  id: string;
  iso_639_1: string;
  iso_3166_1: string;
  key: string;
  name: string;
  site: string;
  size: number;
  type: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Dates {
  maximum: string;
  minimum: string;
}

export interface MovieResponse {
  page: number;
  results: Movie[];
  dates: Dates;
  total_pages: number;
  total_results: number;
}
