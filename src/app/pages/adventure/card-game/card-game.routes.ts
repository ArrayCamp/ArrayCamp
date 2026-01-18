import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'oefening',
    loadComponent: () => import('./card-game').then((m) => m.CardGame),
    children: [
      {
        path: 'voltooid',
        loadComponent: () => import('../exercise-completed/exercise-completed').then((m) => m.ExerciseCompleted),
        data: {
          chapter: 'kaartspel',
        },
      },
      {
        path: '1',
        loadComponent: () => import('./predict/predict').then((m) => m.Predict),
        data: {
          exerciseId: 'kaartspel-1',
        },
      },
      {
        path: '2',
        loadComponent: () => import('./run/run').then((m) => m.Run),
        data: {
          exerciseId: 'kaartspel-2',
        },
      },
      {
        path: '3',
        loadComponent: () => import('./investigate/investigate').then((m) => m.Investigate),
        data: {
          exerciseId: 'kaartspel-3',
        },
      },
      {
        path: '4',
        loadComponent: () => import('./modify/modify').then((m) => m.Modify),
        data: {
          exerciseId: 'kaartspel-4',
        },
      },
      {
        path: '5',
        loadComponent: () => import('./make/make').then((m) => m.Make),
        data: {
          exerciseId: 'kaartspel-5',
        },
      },
      {
        path: '**',
        pathMatch: 'full',
        redirectTo: '1',
      },
    ],
  },
  {
    path: 'voltooid',
    loadComponent: () => import('../chapter-completed/chapter-completed').then((m) => m.ChapterCompleted),
    data: {
      chapter: 'kaartspel',
    },
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'oefening',
  },
];
