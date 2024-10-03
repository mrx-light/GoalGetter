import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegistrationComponent } from './pages/registration/registration.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { LeaguesComponent } from './pages/leagues/leagues.component';
import { PlayersComponent } from './pages/players/players.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'leagues', component: LeaguesComponent },
  { path: 'players', component: PlayersComponent },
];
