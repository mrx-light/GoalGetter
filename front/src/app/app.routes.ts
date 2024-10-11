import { Routes } from '@angular/router';

export const routes: Routes = [
  //
  {
    path: 'players',
    loadChildren: () =>
      import('./pages/players/players.routes').then((m) => m.PlayersRoutes),
  },
  {
    path: 'coaches',
    loadChildren: () =>
      import('./pages/coaches/coaches.routes').then((m) => m.CoachesRoutes),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'registration',
    loadComponent: () =>
      import('./pages/registration/registration.component').then(
        (m) => m.RegistrationComponent,
      ),
  },
  {
    path: 'main',
    loadComponent: () =>
      import('./pages/main/main.component').then((m) => m.MainComponent),
  },
  {
    path: 'leagues',
    loadComponent: () =>
      import('./pages/leagues/leagues.component').then(
        (m) => m.LeaguesComponent,
      ),
  },
  {
    path: 'teams',
    loadComponent: () =>
      import('./pages/teams/teams.component').then((m) => m.TeamsComponent),
  },
  {
    path: 'venues',
    loadComponent: () =>
      import('./pages/venues/venues.component').then((m) => m.VenuesComponent),
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./pages/profile/profile.component').then(
        (m) => m.ProfileComponent,
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  { path: '', redirectTo: '/main', pathMatch: 'full' },
  { path: '**', redirectTo: '/main' },
];
