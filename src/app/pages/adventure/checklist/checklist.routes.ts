import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'oefening',
    loadComponent: () => import('./checklist').then((m) => m.Checklist),
    children: [
      {
        path: 'voltooid',
        loadComponent: () => import('../exercise-completed/exercise-completed').then((m) => m.ExerciseCompleted),
        data: {
          chapter: 'checklist',
        },
      },
      {
        path: '1',
        loadComponent: () => import('./predict/predict').then((m) => m.Predict),
        data: {
          exerciseId: 'checklist-1',
        },
      },
      {
        path: '2',
        loadComponent: () => import('./run/run').then((m) => m.Run),
        data: {
          exerciseId: 'checklist-2',
        },
      },
      {
        path: '3',
        loadComponent: () => import('./investigate/investigate').then((m) => m.Investigate),
        data: {
          exerciseId: 'checklist-3',
        },
      },
      {
        path: '4',
        loadComponent: () => import('./modify/modify').then((m) => m.Modify),
        data: {
          exerciseId: 'checklist-4',
        },
      },
      {
        path: '5',
        loadComponent: () => import('./make/make').then((m) => m.Make),
        data: {
          exerciseId: 'checklist-5',
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
      chapter: 'checklist',
    },
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'oefening',
  },
];
