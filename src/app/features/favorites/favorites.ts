import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { FavoritesService } from '../../core/services/favorites.service';
import { MovieSummary } from '../../core/models/movie.model';
import { MovieCardComponent } from '../../shared/components/movie-card/movie-card';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state';
import { MovieDetailModalComponent, MovieDialogData }
  from '../../shared/components/movie-detail-modal/movie-detail-modal';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule,
    MovieCardComponent, EmptyStateComponent],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1>❤️ Mis favoritos</h1>
          <p>{{ count() }} película{{ count() !== 1 ? 's' : '' }} guardada{{ count() !== 1 ? 's' : '' }}</p>
        </div>
        @if (count() > 0) {
          <button mat-stroked-button color="warn" (click)="clearAll()">
            <mat-icon>delete_sweep</mat-icon> Limpiar todo
          </button>
        }
      </div>

      @if (count() === 0) {
        <app-empty-state
          icon="favorite_border"
          title="Sin favoritos aún"
          message="Agrega películas usando el ícono ♥ en cualquier tarjeta o desde el detalle."
        />
        <div style="text-align:center; margin-top: 24px;">
          <button mat-flat-button color="primary" routerLink="/">Explorar películas</button>
        </div>
      } @else {
        <div class="grid">
          @for (m of favorites(); track m.id) {
            <app-movie-card [movie]="m" (detail)="openDetail($event)" />
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .page { max-width: 1400px; margin: 0 auto; }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 24px 0 32px;
      h1 { margin: 0 0 4px; font-size: 2rem; font-weight: 800; }
      p  { margin: 0; color: rgba(255,255,255,0.4); font-size: 0.95rem; }
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: 20px;
    }
    @media (max-width: 600px) {
      .page-header { flex-direction: column; gap: 12px; }
      .grid { grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px; }
    }
  `]
})
export class FavoritesComponent {
  private favs   = inject(FavoritesService);
  private dialog = inject(MatDialog);

  favorites = this.favs.favorites;
  count     = this.favs.count;

  openDetail(movie: MovieSummary): void {
    this.dialog.open(MovieDetailModalComponent, {
      data: { movie } as MovieDialogData,
      panelClass: 'detail-dialog',
      maxWidth: '100vw',
      autoFocus: false
    });
  }

  clearAll(): void {
    [...this.favorites()].forEach(m => this.favs.toggle(m));
  }
}
