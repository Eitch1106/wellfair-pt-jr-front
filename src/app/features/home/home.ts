import { Component, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { MovieService } from '../../core/services/movie.service';
import { MovieSummary, Genre } from '../../core/models/movie.model';
import { MovieCardComponent } from '../../shared/components/movie-card/movie-card';
import { LoadingSkeletonComponent } from '../../shared/components/loading-skeleton/loading-skeleton';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state';
import { MovieDetailModalComponent, MovieDialogData }
  from '../../shared/components/movie-detail-modal/movie-detail-modal';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FormsModule, MatFormFieldModule, MatInputModule,
    MatIconModule, MatButtonModule, MatChipsModule,
    MatPaginatorModule, MovieCardComponent,
    LoadingSkeletonComponent, EmptyStateComponent
  ],
  template: `
    <div class="home">

      <!-- Hero + Buscador -->
      <section class="hero">
        <h1 class="hero-title">Adéntrate en el mundo del cine</h1>
        <p class="hero-sub">Millones de películas para explorar</p>

        <mat-form-field class="search-field" appearance="outline">
          <mat-icon matPrefix>search</mat-icon>
          <input
            matInput
            placeholder="Buscar película..."
            [(ngModel)]="searchQuery"
            (ngModelChange)="onSearch($event)"
            autocomplete="off"
          />
          @if (searchQuery) {
            <button matSuffix mat-icon-button (click)="clearSearch()" aria-label="Limpiar">
              <mat-icon>close</mat-icon>
            </button>
          }
        </mat-form-field>
      </section>

      <!-- Chips de género (ocultos durante búsqueda) -->
      @if (!searchQuery) {
        <div class="genres-wrap">
          <mat-chip-listbox [(ngModel)]="selectedGenreId" (change)="onGenreChange($event.value)">
            <mat-chip-option [value]="null">Todos</mat-chip-option>
            @for (g of genres(); track g.id) {
              <mat-chip-option [value]="g.id">{{ g.name }}</mat-chip-option>
            }
          </mat-chip-listbox>
        </div>
      }

      <!-- Título de sección -->
      <h2 class="section-title">
        @if (searchQuery) { Resultados para "{{ searchQuery }}" }
        @else if (selectedGenreId) { {{ selectedGenreName() }} }
        @else { 🔥 Películas populares }
      </h2>

      @if (loading()) {
        <app-loading-skeleton [count]="20" />
      } @else if (movies().length === 0) {
        <app-empty-state
          icon="search_off"
          title="Sin resultados"
          [message]="searchQuery
            ? 'No encontramos películas para &quot;' + searchQuery + '&quot;'
            : 'No hay películas disponibles en este momento'"
        />
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
    .home { max-width: 1400px; margin: 0 auto; }

    /* Hero */
    .hero {
      text-align: center;
      padding: 48px 16px 36px;
    }
    .hero-title {
      font-size: clamp(2rem, 5vw, 3.5rem);
      font-weight: 800;
      margin: 0 0 8px;
      background: linear-gradient(135deg, #fff 40%, rgba(255,255,255,0.35));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .hero-sub {
      color: rgba(255,255,255,0.4);
      margin: 0 0 28px;
      font-size: 1rem;
    }
    .search-field { width: 100%; max-width: 580px; }

    /* Géneros */
    .genres-wrap {
      overflow-x: auto;
      padding-bottom: 12px;
      scrollbar-width: none;
      &::-webkit-scrollbar { display: none; }
    }

    .section-title {
      font-size: 1.1rem;
      font-weight: 600;
      margin: 8px 0 20px;
      color: rgba(255,255,255,0.8);
    }

    /* Grid */
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: 20px;
    }
    mat-paginator { background: transparent; margin-top: 32px; }

    @media (max-width: 600px) {
      .hero { padding: 28px 16px 24px; }
      .grid { grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px; }
    }
  `]
})
export class HomeComponent implements OnInit, OnDestroy {
  private svc     = inject(MovieService);
  private dialog  = inject(MatDialog);
  private destroy$ = new Subject<void>();
  private search$  = new Subject<string>();

  movies       = signal<MovieSummary[]>([]);
  genres       = signal<Genre[]>([]);
  loading      = signal(true);
  totalResults = signal(0);
  currentPage  = signal(1);

  searchQuery    = '';
  selectedGenreId: number | null = null;

  selectedGenreName = computed(() =>
    this.genres().find(g => g.id === this.selectedGenreId)?.name ?? ''
  );

  ngOnInit(): void {
    // Debounce: solo dispara petición 400ms después de que el usuario deja de escribir para evitar peiciones excesivas
    this.search$.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(q => {
      this.currentPage.set(1);
      q ? this.fetchSearch(q, 1) : this.fetchPopular(1);
    });

    this.svc.getGenres().subscribe({ next: gs => this.genres.set(gs) });
    this.fetchPopular(1);
  }

  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }

  onSearch(q: string)  { this.search$.next(q.trim()); }

  clearSearch(): void {
    this.searchQuery    = '';
    this.selectedGenreId = null;
    this.currentPage.set(1);
    this.fetchPopular(1);
  }

  onGenreChange(id: number | null): void {
    this.currentPage.set(1);
    id ? this.fetchByGenre(id, 1) : this.fetchPopular(1);
  }

  onPage(e: PageEvent): void {
    const page = e.pageIndex + 1;
    this.currentPage.set(page);
    if (this.searchQuery)   this.fetchSearch(this.searchQuery, page);
    else if (this.selectedGenreId) this.fetchByGenre(this.selectedGenreId, page);
    else                    this.fetchPopular(page);
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

  private fetchPopular(page: number): void {
    this.loading.set(true);
    this.svc.getPopular(page).subscribe({
      next:  r  => { this.movies.set(r.results); this.totalResults.set(r.totalResults); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  private fetchSearch(q: string, page: number): void {
    this.loading.set(true);
    this.svc.search(q, page).subscribe({
      next:  r  => { this.movies.set(r.results); this.totalResults.set(r.totalResults); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  private fetchByGenre(id: number, page: number): void {
    this.loading.set(true);
    this.svc.getByGenre(id, page).subscribe({
      next:  r  => { this.movies.set(r.results); this.totalResults.set(r.totalResults); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }
}
