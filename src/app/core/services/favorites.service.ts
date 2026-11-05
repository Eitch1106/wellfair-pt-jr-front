import { Injectable, signal, computed } from '@angular/core';
import { MovieSummary } from '../models/movie.model';

const STORAGE_KEY = 'tmdb_favorites';

@Injectable({ providedIn: 'root' })
export class FavoritesService {

  private readonly _favorites = signal<MovieSummary[]>(this.load());

  readonly favorites = this._favorites.asReadonly();
  readonly count = computed(() => this._favorites().length);

  isFavorite(id: number): boolean {
    return this._favorites().some(m => m.id === id);
  }

  toggle(movie: MovieSummary): void {
    const current = this._favorites();
    const updated = this.isFavorite(movie.id)
      ? current.filter(m => m.id !== movie.id)
      : [...current, movie];

    this._favorites.set(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  private load(): MovieSummary[] {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    } catch {
      return [];
    }
  }
}
