import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { DecimalPipe, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MovieSummary } from '../../../core/models/movie.model';
import { FavoritesService } from '../../../core/services/favorites.service';
import { RatingColorPipe } from '../../pipes/rating-color-pipe';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [
    DecimalPipe,
    DatePipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    RatingColorPipe,
  ],
  template: `
    <mat-card class="movie-card" (click)="detail.emit(movie)">
      <div class="poster-wrap">
        <img
          [src]="movie.posterUrl ?? PLACEHOLDER"
          [alt]="movie.title"
          class="poster"
          loading="lazy"
          (error)="onImgError($event)"
        />
        <!-- Badge de calificación -->
        <span class="rating-badge" [style.color]="movie.voteAverage | ratingColor">
          ★ {{ movie.voteAverage | number: '1.1-1' }}
        </span>
        <!-- Botón favorito -->
        <button
          mat-icon-button
          class="fav-btn"
          [matTooltip]="isFav() ? 'Quitar de favoritos' : 'Agregar a favoritos'"
          (click)="onFav($event)"
          aria-label="Favorito"
        >
          <mat-icon [style.color]="isFav() ? '#ef5350' : 'rgba(255,255,255,0.65)'">
            {{ isFav() ? 'favorite' : 'favorite_border' }}
          </mat-icon>
        </button>
      </div>

      <mat-card-content class="card-content">
        <p class="title" [matTooltip]="movie.title">{{ movie.title }}</p>
        <p class="date">{{ movie.releaseDate | date: 'MMM y' }}</p>
      </mat-card-content>

      <mat-card-actions>
        <button mat-button color="primary" (click)="detail.emit(movie)">Ver detalles</button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [
    `
      .movie-card {
        background: #191919;
        border-radius: 12px !important;
        overflow: hidden;
        cursor: pointer;
        height: 100%;
        display: flex;
        flex-direction: column;
        transition:
          transform 0.2s ease,
          box-shadow 0.2s ease;
        border: 1px solid rgba(255, 255, 255, 0.05);

        &:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 36px rgba(0, 0, 0, 0.65);
        }
      }
      .poster-wrap {
        position: relative;
      }
      .poster {
        width: 100%;
        aspect-ratio: 2/3;
        object-fit: cover;
        display: block;
      }
      .rating-badge {
        position: absolute;
        bottom: 8px;
        left: 8px;
        background: rgba(0, 0, 0, 0.78);
        backdrop-filter: blur(4px);
        padding: 2px 8px;
        border-radius: 20px;
        font-size: 0.78rem;
        font-weight: 700;
      }
      .fav-btn {
        position: absolute;
        top: 4px;
        right: 4px;
        background: rgba(0, 0, 0, 0.5) !important;
        width: 34px;
        height: 34px;
        line-height: 34px;
      }
      .card-content {
        padding: 10px 12px 0 !important;
        flex: 1;
      }
      .title {
        margin: 0;
        font-size: 0.88rem;
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #efefef;
      }
      .date {
        margin: 4px 0 0;
        font-size: 0.74rem;
        color: rgba(255, 255, 255, 0.4);
      }
    `,
  ],
})
export class MovieCardComponent {
  @Input({ required: true }) movie!: MovieSummary;
  @Output() detail = new EventEmitter<MovieSummary>();

  private favs = inject(FavoritesService);
  readonly PLACEHOLDER = 'assets/images/no-poster.png';

  isFav() {
    return this.favs.isFavorite(this.movie.id);
  }
  onFav(e: Event) {
    e.stopPropagation();
    this.favs.toggle(this.movie);
  }
  onImgError(e: Event) {
    (e.target as HTMLImageElement).src = this.PLACEHOLDER;
  }
}
