export const PlayersRoutes = [
  {
    path: '',
    loadComponent: () =>
      import('./players.component').then((mod) => mod.PlayersComponent),
  },
  {
    path: ':id/:season',
    loadComponent: () =>
      import('./../player/player.component').then((mod) => mod.PlayerComponent),
  },
];
