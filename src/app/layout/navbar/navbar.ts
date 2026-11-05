import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { FavoritesService } from '../../core/services/favorites.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatToolbarModule,
    MatButtonModule, MatIconModule, MatBadgeModule],
  template: `
    <mat-toolbar class="navbar">
      <span class="brand" routerLink="/">🎬 TMDb-BY-WELLFAIR</span>
      <span class="spacer"></span>
      <nav class="nav-links">
        <a mat-button routerLink="/" routerLinkActive="active"
           [routerLinkActiveOptions]="{exact: true}">
          <mat-icon>whatshot</mat-icon> Popular
        </a>
        <a mat-button routerLink="/top-rated" routerLinkActive="active">
          <mat-icon>star</mat-icon> Top Rated
        </a>
        <a mat-button routerLink="/favorites" routerLinkActive="active">
          <mat-icon
            [matBadge]="favCount() > 0 ? favCount() : null"
            matBadgeColor="warn"
            matBadgeSize="small">
            favorite
          </mat-icon>
          Favoritos
        </a>
      </nav>
    </mat-toolbar>
  `,
  styles: [`
    .navbar {
      position: sticky;
      top: 0;
      z-index: 100;
      background: rgba(13,13,13,0.95);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(255,255,255,0.07);
    }
    .brand {
      font-size: 1.25rem;
      font-weight: 700;
      cursor: pointer;
      letter-spacing: 1px;
    }
    .spacer { flex: 1; }
    .nav-links a {
      margin-left: 4px;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 0.9rem;
    }
    .nav-links a.active { color: var(--mat-sys-primary); }

    @media (max-width: 480px) {
      .nav-links a span { display: none; }
    }
  `]
})
export class NavbarComponent {
  favCount = inject(FavoritesService).count;  // Signal — se actualiza solo
}
