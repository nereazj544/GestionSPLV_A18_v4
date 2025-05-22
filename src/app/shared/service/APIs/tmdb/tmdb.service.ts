import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TmdbService {

    private apiKey: string = 'eacd019b8cb7e306bef6c75083fdb496';
    private apiUrl: string = 'https://api.themoviedb.org/3';

    constructor(private http: HttpClient) { }


    getMovies(page: number = 1): Observable<any> {
        return this.http.get(`${this.apiUrl}/movie/popular`, {
            params: {
                api_key: this.apiKey,
                page: page.toString(),
                language: 'es-ES',
                region: 'ES'
            }
        });
    }

    getMovieDetails(id: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/movie/${id}?api_key=${this.apiKey}`);
    }



    searchMovies(query: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/search/movie`, {
            params: {
                api_key: this.apiKey,
                query: query,
                language: 'es-ES'
            }
        });
    }


    // Películas más recientes
    getLatestMovies(page: number = 1): Observable<any> {
        return this.http.get(`${this.apiUrl}/movie/upcoming`, {
            params: {
                api_key: this.apiKey,
                page: page.toString(),
                language: 'es-ES',
                region: 'ES',
                adult: 'false'
            }
        });
    }

    // Series más recientes
    getLatestTvSeries(page: number = 1): Observable<any> {
        return this.http.get(`${this.apiUrl}/tv/airing_today`, {
            params: {
                api_key: this.apiKey,
                page: page.toString(),
                language: 'es-ES',
                region: 'ES'
            }
        });
    }

}
