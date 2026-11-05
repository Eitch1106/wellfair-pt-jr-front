import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-skeleton',
  standalone: true,
  template: `
    <div class="skeleton-grid">
      @for (item of items; track $index) {
        <div class="skeleton-card">
          <div class="skeleton-img shimmer"></div>
          <div class="skeleton-body">
            <div class="skeleton-line long shimmer"></div>
            <div class="skeleton-line short shimmer"></div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .skeleton-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: 20px;
    }
    .skeleton-card { border-radius: 12px; overflow: hidden; background: #1a1a1a; }
    .skeleton-img { width: 100%; aspect-ratio: 2/3; }
    .skeleton-body { padding: 12px; display: flex; flex-direction: column; gap: 8px; }
    .skeleton-line { height: 11px; border-radius: 6px; background: #2a2a2a; }
    .long  { width: 85%; }
    .short { width: 50%; }

    .shimmer {
      background: linear-gradient(90deg, #1a1a1a 25%, #2c2c2c 50%, #1a1a1a 75%);
      background-size: 200% 100%;
      animation: shimmer 1.4s infinite;
    }
    @keyframes shimmer {
      0%   { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `]
})
export class LoadingSkeletonComponent {
  @Input() count = 12;
  get items() { return Array(this.count); }
}
