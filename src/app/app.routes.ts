import { Routes } from '@angular/router';
import { authGuard } from './guards/auth';
import { isDevMode } from '@angular/core';

export const routes: Routes = [
  {
    path: 'dev',
    loadComponent: () => import('./pages/dev/dev').then((m) => m.Dev),
    canActivate: [isDevMode],
    title: 'ArrayCamp - Dev',
  },
  {
    path: 'avontuur',
    loadChildren: () => import('./pages/adventure/adventure.routes').then((m) => m.routes),
    canActivate: [authGuard],
    title: 'ArrayCamp - Avontuur',
  },
  {
    path: 'aanmelden',
    loadComponent: () => import('./pages/sign-in/sign-in').then((m) => m.SignIn),
    title: 'ArrayCamp - Aanmelden',
  },
  {
    path: 'registreren',
    loadComponent: () => import('./pages/sign-up/sign-up').then((m) => m.SignUp),
    title: 'ArrayCamp - Registreren',
  },
  {
    path: 'profiel',
    loadComponent: () => import('./pages/profile/profile').then((m) => m.Profile),
    canActivate: [authGuard],
    title: 'ArrayCamp - Profiel',
  },
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
    title: 'ArrayCamp',
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '',
  },
];
