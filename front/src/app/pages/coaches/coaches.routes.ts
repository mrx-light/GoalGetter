export const CoachesRoutes = [
  {
    path: '',
    loadComponent: () =>
      import('./coaches.component').then((mod) => mod.CoachesComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./../coach/coach.component').then((mod) => mod.CoachComponent),
  },
];
