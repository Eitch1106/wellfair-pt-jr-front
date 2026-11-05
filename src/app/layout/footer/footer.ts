import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="footer">
      <span>Datos provistos por
        <a href="https://www.themoviedb.org" target="_blank" rel="noopener">TMDb</a>
        · Well Fair prueba técnica {{ year }} BY IGC
      </span>
    </footer>
  `,
  styles: [`
    .footer {
      text-align: center;
      padding: 20px 16px;
      font-size: 0.78rem;
      color: rgba(255,255,255,0.3);
      border-top: 1px solid rgba(255,255,255,0.06);
    }
    a { color: rgba(255,255,255,0.5); text-decoration: none; }
    a:hover { color: #fff; }
  `]
})
export class FooterComponent {
  year = new Date().getFullYear();
}
