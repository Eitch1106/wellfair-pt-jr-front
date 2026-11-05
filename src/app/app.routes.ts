import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home')
      .then(m => m.HomeComponent)
  },
  {
    path: 'top-rated',
    loadComponent: () => import('./features/top-rated/top-rated')
      .then(m => m.TopRatedComponent)
  },
  {
    path: 'favorites',
    loadComponent: () => import('./features/favorites/favorites')
      .then(m => m.FavoritesComponent)
  },
  { path: '**', redirectTo: '' }
];
