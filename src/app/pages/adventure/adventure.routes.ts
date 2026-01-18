import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'checklist',
    loadChildren: () => import('./checklist/checklist.routes').then((m) => m.routes),
  },
  {
    path: 'kaartspel',
    loadChildren: () => import('./card-game/card-game.routes').then((m) => m.routes),
  },
  {
    path: 'hittegolf',
    loadChildren: () => import('./heatwave/heatwave.routes').then((m) => m.routes),
  },
  {
    path: 'sport',
    loadChildren: () => import('./sport/sport.routes').then((m) => m.routes),
  },
  {
    path: 'campingplaats',
    loadChildren: () => import('./camping-place/camping-place.routes').then((m) => m.routes),
  },
  {
    path: '',
    loadComponent: () => import('./adventure').then((m) => m.Adventure),
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '',
  },
];
