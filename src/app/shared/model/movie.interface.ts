export interface Movie {
    id: number;
    title: string;
    overview: string;
    release_date: string;
    original_language: string;
    poster_path: string;
    backdrop_path: string;
    adult: boolean;
    without_genres: string[];
}

export interface MovieResponse {
    page: number;
    results: Movie[];
    total_results: number;
    total_pages: number;
}
