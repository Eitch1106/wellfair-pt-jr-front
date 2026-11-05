import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApiResponse, PagedResponse } from '../models/api-response.model';
import { MovieSummary, MovieDetail, Genre } from '../models/movie.model';
import { environment } from '../../../enviroments/environment.dev';

@Injectable({ providedIn: 'root' })
export class MovieService {

  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBaseUrl}/movies`;

  private unwrap<T>(obs: Observable<ApiResponse<T>>): Observable<T> {
    return obs.pipe(map(r => r.data));
  }

  getPopular(page = 1): Observable<PagedResponse<MovieSummary>> {
    const params = new HttpParams().set('page', page);
    return this.unwrap(
      this.http.get<ApiResponse<PagedResponse<MovieSummary>>>(`${this.base}/popular`, { params })
    );
  }

  getTopRated(page = 1): Observable<PagedResponse<MovieSummary>> {
    const params = new HttpParams().set('page', page);
    return this.unwrap(
      this.http.get<ApiResponse<PagedResponse<MovieSummary>>>(`${this.base}/top-rated`, { params })
    );
  }

  search(query: string, page = 1): Observable<PagedResponse<MovieSummary>> {
    const params = new HttpParams().set('query', query).set('page', page);
    return this.unwrap(
      this.http.get<ApiResponse<PagedResponse<MovieSummary>>>(`${this.base}/search`, { params })
    );
  }

  getDetail(id: number): Observable<MovieDetail> {
    return this.unwrap(
      this.http.get<ApiResponse<MovieDetail>>(`${this.base}/${id}`)
    );
  }

  getByGenre(genreId: number, page = 1): Observable<PagedResponse<MovieSummary>> {
    const params = new HttpParams().set('page', page);
    return this.unwrap(
      this.http.get<ApiResponse<PagedResponse<MovieSummary>>>(`${this.base}/genre/${genreId}`, { params })
    );
  }

  getGenres(): Observable<Genre[]> {
    return this.unwrap(
      this.http.get<ApiResponse<Genre[]>>(`${this.base}/genres`)
    );
  }
}
