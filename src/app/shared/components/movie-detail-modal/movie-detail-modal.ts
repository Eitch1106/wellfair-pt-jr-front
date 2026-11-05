import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DecimalPipe, DatePipe, UpperCasePipe } from '@angular/common';
import { MovieDetail, MovieSummary } from '../../../core/models/movie.model';
import { MovieService } from '../../../core/services/movie.service';
import { FavoritesService } from '../../../core/services/favorites.service';
import { RatingColorPipe } from '../../pipes/rating-color-pipe';

export interface MovieDialogData { movie: MovieSummary; }

@Component({
  selector: 'app-movie-detail-modal',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    DecimalPipe,
    DatePipe,
    UpperCasePipe,
    RatingColorPipe,
  ],
  template: `
    <div class="modal-wrap">
      <!-- CARGANDO -->
      @if (loading()) {
        <div class="center-state">
          <mat-spinner diameter="52" />
        </div>
      }

      <!-- ERROR -->
      @if (error()) {
        <div class="center-state">
          <mat-icon class="error-icon">error_outline</mat-icon>
          <p>No se pudo cargar el detalle</p>
          <button mat-flat-button (click)="load()">Reintentar</button>
        </div>
      }

      <!-- CONTENIDO -->
      @if (detail(); as d) {
        <!-- Backdrop / Header -->
        <div
          class="backdrop"
          [style.background-image]="d.backdropUrl ? 'url(' + d.backdropUrl + ')' : 'none'"
        >
          <div class="backdrop-overlay"></div>
          <button mat-icon-button class="close-btn" mat-dialog-close aria-label="Cerrar">
            <mat-icon>close</mat-icon>
          </button>
        </div>

        <!-- Body -->
        <div class="modal-body">
          <div class="layout">
            <!-- Poster -->
            <img
              [src]="d.posterUrl ?? 'assets/images/no-poster.png'"
              [alt]="d.title"
              class="poster"
              (error)="onImgError($event)"
            />

            <!-- Info -->
            <div class="info">
              <h2 class="title">{{ d.title }}</h2>

              @if (d.tagline) {
                <p class="tagline">{{ d.tagline }}</p>
              }

              <!-- Meta row -->
              <div class="meta-row">
                <span class="rating" [style.color]="d.voteAverage | ratingColor">
                  ★ {{ d.voteAverage | number: '1.1-1' }}
                  <span class="vote-count">({{ d.voteCount | number }})</span>
                </span>
                @if (d.runtimeFormatted) {
                  <span class="chip">
                    <mat-icon inline>schedule</mat-icon> {{ d.runtimeFormatted }}
                  </span>
                }
                <span class="chip">
                  <mat-icon inline>calendar_today</mat-icon>
                  {{ d.releaseDate | date: 'd MMM y' }}
                </span>
                <span class="chip">
                  <mat-icon inline>language</mat-icon>
                  {{ d.originalLanguage | uppercase }}
                </span>
              </div>

              <!-- Géneros -->
              @if (d.genres.length) {
                <mat-chip-set class="genres">
                  @for (g of d.genres; track g.id) {
                    <mat-chip>{{ g.name }}</mat-chip>
                  }
                </mat-chip-set>
              }

              <!-- Sinopsis -->
              @if (d.overview) {
                <p class="overview">{{ d.overview }}</p>
              } @else {
                <p class="overview muted">Sin sinopsis disponible.</p>
              }
            </div>
          </div>
        </div>

        <!-- Actions -->
        <mat-dialog-actions align="end" class="modal-actions">
          <button mat-button (click)="toggleFav(d)">
            <mat-icon [style.color]="isFav(d.id) ? '#ef5350' : ''">
              {{ isFav(d.id) ? 'favorite' : 'favorite_border' }}
            </mat-icon>
            {{ isFav(d.id) ? 'En favoritos' : 'Agregar' }}
          </button>
          @if (d.imdbId) {
            <a
              mat-button
              [href]="'https://www.imdb.com/title/' + d.imdbId"
              target="_blank"
              rel="noopener"
            >
              <mat-icon>open_in_new</mat-icon> IMDb
            </a>
          }
          <button mat-button mat-dialog-close>Cerrar</button>
        </mat-dialog-actions>
      }
    </div>
  `,
  styles: [
    `
      .modal-wrap {
        width: min(90vw, 740px);
        background: #141414;
        border-radius: 14px;
        overflow: hidden;
      }
      .center-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 16px;
        padding: 80px 24px;
        .error-icon {
          font-size: 52px;
          width: 52px;
          height: 52px;
          color: #ef5350;
        }
        p {
          color: rgba(255, 255, 255, 0.5);
          margin: 0;
        }
      }

      /* Backdrop */
      .backdrop {
        position: relative;
        height: 190px;
        background: #222 center/cover no-repeat;
      }
      .backdrop-overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(to bottom, rgba(0, 0, 0, 0.25) 0%, #141414 100%);
      }
      .close-btn {
        position: absolute;
        top: 8px;
        right: 8px;
        background: rgba(0, 0, 0, 0.55);
        z-index: 2;
      }

      /* Body */
      .modal-body {
        padding: 0 24px 8px;
      }
      .layout {
        display: flex;
        gap: 24px;
        align-items: flex-start;
        margin-top: -56px;
        position: relative;
      }
      .poster {
        width: 110px;
        min-width: 110px;
        aspect-ratio: 2/3;
        object-fit: cover;
        border-radius: 8px;
        box-shadow: 0 6px 24px rgba(0, 0, 0, 0.7);
        flex-shrink: 0;
      }
      .info {
        flex: 1;
        padding-top: 64px;
        min-width: 0;
      }

      .title {
        margin: 0 0 4px;
        font-size: 1.45rem;
        font-weight: 700;
        line-height: 1.2;
      }
      .tagline {
        margin: 0 0 12px;
        font-style: italic;
        color: rgba(255, 255, 255, 0.45);
        font-size: 0.88rem;
      }
      .meta-row {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        align-items: center;
        margin-bottom: 12px;
      }
      .rating {
        font-size: 1.1rem;
        font-weight: 700;
      }
      .vote-count {
        font-size: 0.72rem;
        font-weight: 400;
        color: rgba(255, 255, 255, 0.4);
      }
      .chip {
        display: inline-flex;
        align-items: center;
        gap: 3px;
        font-size: 0.8rem;
        color: rgba(255, 255, 255, 0.55);
        background: rgba(255, 255, 255, 0.07);
        padding: 3px 10px;
        border-radius: 20px;
      }
      .genres {
        margin-bottom: 12px;
      }
      .overview {
        font-size: 0.9rem;
        line-height: 1.65;
        color: rgba(255, 255, 255, 0.75);
        margin: 8px 0 0;
      }
      .muted {
        color: rgba(255, 255, 255, 0.3);
        font-style: italic;
      }

      .modal-actions {
        padding: 0 16px 8px !important;
      }

      /* Responsive */
      @media (max-width: 520px) {
        .modal-wrap {
          width: 95vw;
        }
        .layout {
          flex-direction: column;
          margin-top: -40px;
        }
        .poster {
          width: 90px;
        }
        .info {
          padding-top: 8px;
        }
        .title {
          font-size: 1.15rem;
        }
      }
    `,
  ],
})
export class MovieDetailModalComponent {
  private svc = inject(MovieService);
  private favs = inject(FavoritesService);
  readonly data = inject<MovieDialogData>(MAT_DIALOG_DATA);

  detail = signal<MovieDetail | null>(null);
  loading = signal(true);
  error = signal(false);

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(false);
    this.svc.getDetail(this.data.movie.id).subscribe({
      next: (d) => {
        this.detail.set(d);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }

  isFav(id: number) {
    return this.favs.isFavorite(id);
  }

  toggleFav(d: MovieDetail): void {
    this.favs.toggle({
      id: d.id,
      title: d.title,
      originalTitle: d.originalTitle,
      overview: d.overview,
      posterUrl: d.posterUrl,
      releaseDate: d.releaseDate,
      voteAverage: d.voteAverage,
      voteCount: d.voteCount,
      popularity: d.popularity,
      originalLanguage: d.originalLanguage,
    });
  }

  onImgError(e: Event) {
    (e.target as HTMLImageElement).src = 'assets/images/no-poster.png';
  }
}
