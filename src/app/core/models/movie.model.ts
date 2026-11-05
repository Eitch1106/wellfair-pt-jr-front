// Para listados (popular, búsqueda, top-rated)
export interface MovieSummary {
  id: number;
  title: string;
  originalTitle: string;
  overview: string;
  posterUrl: string | null;
  releaseDate: string;
  voteAverage: number;
  voteCount: number;
  popularity: number;
  originalLanguage: string;
}

// Para el modal de detalle
export interface MovieDetail {
  id: number;
  title: string;
  originalTitle: string;
  tagline: string | null;
  overview: string;
  status: string;
  posterUrl: string | null;
  backdropUrl: string | null;
  releaseDate: string;
  voteAverage: number;
  voteCount: number;
  runtime: number | null;
  runtimeFormatted: string | null;
  popularity: number;
  budget: number;
  revenue: number;
  originalLanguage: string;
  imdbId: string | null;
  genres: Genre[];
}

export interface Genre {
  id: number;
  name: string;
}
