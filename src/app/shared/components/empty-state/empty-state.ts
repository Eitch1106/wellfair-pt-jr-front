import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="empty">
      <mat-icon class="empty-icon">{{ icon }}</mat-icon>
      <h3>{{ title }}</h3>
      <p>{{ message }}</p>
    </div>
  `,
  styles: [`
    .empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 80px 24px;
      text-align: center;
      color: rgba(255,255,255,0.35);
    }
    .empty-icon {
      font-size: 60px; width: 60px; height: 60px;
      margin-bottom: 16px; opacity: 0.5;
    }
    h3 { margin: 0 0 8px; font-size: 1.25rem; color: rgba(255,255,255,0.6); }
    p  { margin: 0; font-size: 0.9rem; }
  `]
})
export class EmptyStateComponent {
  @Input() icon    = 'movie_filter';
  @Input() title   = 'Sin resultados';
  @Input() message = 'No se encontraron películas.';
}
