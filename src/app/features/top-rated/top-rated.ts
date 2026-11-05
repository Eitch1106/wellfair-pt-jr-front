import { Component, inject, signal, OnInit } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MovieService } from '../../core/services/movie.service';
import { MovieSummary } from '../../core/models/movie.model';
import { MovieCardComponent } from '../../shared/components/movie-card/movie-card';
import { LoadingSkeletonComponent } from '../../shared/components/loading-skeleton/loading-skeleton';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state';
import { MovieDetailModalComponent, MovieDialogData }
  from '../../shared/components/movie-detail-modal/movie-detail-modal';

@Component({
  selector: 'app-top-rated',
  standalone: true,
  imports: [MatPaginatorModule, MovieCardComponent, LoadingSkeletonComponent, EmptyStateComponent],
  template: `
    <div class="page">
      <div class="page-header">
        <h1>⭐ Mejor calificadas</h1>
        <p>Las películas más valoradas por la comunidad global</p>
      </div>

      @if (loading()) {
        <app-loading-skeleton [count]="20" />
      } @else if (movies().length === 0) {
        <app-empty-state title="Sin películas" message="No se encontraron resultados." />
      } @else {
        <div class="grid">
          @for (m of movies(); track m.id) {
            <app-movie-card [movie]="m" (detail)="openDetail($event)" />
          }
        </div>
        <mat-paginator
          [length]="totalResults()"
          [pageSize]="20"
          [pageIndex]="currentPage() - 1"
          [showFirstLastButtons]="true"
          (page)="onPage($event)"
          hidePageSize
        />
      }
    </div>
  `,
  styles: [`
    .page { max-width: 1400px; margin: 0 auto; }
    .page-header { padding: 24px 0 32px; }
    .page-header h1 { margin: 0 0 4px; font-size: 2rem; font-weight: 800; }
    .page-header p  { margin: 0; color: rgba(255,255,255,0.4); font-size: 0.95rem; }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: 20px;
    }
    mat-paginator { background: transparent; margin-top: 32px; }
    @media (max-width: 600px) {
      .grid { grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px; }
    }
  `]
})
export class TopRatedComponent implements OnInit {
  private svc    = inject(MovieService);
  private dialog = inject(MatDialog);

  movies       = signal<MovieSummary[]>([]);
  loading      = signal(true);
  totalResults = signal(0);
  currentPage  = signal(1);

  ngOnInit() { this.fetch(1); }

  onPage(e: PageEvent): void {
    const page = e.pageIndex + 1;
    this.currentPage.set(page);
    this.fetch(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  openDetail(movie: MovieSummary): void {
    this.dialog.open(MovieDetailModalComponent, {
      data: { movie } as MovieDialogData,
      panelClass: 'detail-dialog',
      maxWidth: '100vw',
      autoFocus: false
    });
  }

  private fetch(page: number): void {
    this.loading.set(true);
    this.svc.getTopRated(page).subscribe({
      next:  r  => { this.movies.set(r.results); this.totalResults.set(r.totalResults); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }
}
