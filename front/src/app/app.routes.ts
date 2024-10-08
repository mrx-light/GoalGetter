import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegistrationComponent } from './pages/registration/registration.component';
import { MainComponent } from './pages/main/main.component';
import { LeaguesComponent } from './pages/leagues/leagues.component';
import { PlayersComponent } from './pages/players/players.component';
import { PlayerComponent } from './pages/player/player.component';
import { TeamsComponent } from './pages/teams/teams.component';
import { CoachesComponent } from './pages/coaches/coaches.component';
import { CoachComponent } from './pages/coach/coach.component';
import { VenuesComponent } from './pages/venues/venues.component';
import { ProfileComponent } from './pages/profile/profile.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'main', component: MainComponent },
  { path: 'leagues', component: LeaguesComponent },
  { path: 'players', component: PlayersComponent },
  { path: 'teams', component: TeamsComponent },
  { path: 'coaches', component: CoachesComponent },
  { path: 'venues', component: VenuesComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'coach/:id', component: CoachComponent },
  { path: 'player/:id/:season', component: PlayerComponent },
  { path: '', redirectTo: '/main', pathMatch: 'full' },
  { path: '**', redirectTo: '/main' },
];
