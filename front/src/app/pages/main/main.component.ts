import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { LeaguesCardComponent } from '../../components/leagues-card/leagues-card.component';
import { TeamCardComponent } from '../../components/team-card/team-card.component';
import { CoachCardComponent } from '../../components/coach-card/coach-card.component';
import { PlayerCardComponent } from '../../components/player-card/player-card.component';
import { VenueCardComponent } from '../../components/venue-card/venue-card.component';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { Subject, takeUntil } from 'rxjs';
import { MenuComponent } from '../../layouts/menu/menu.component';
import { HeaderComponent } from '../../layouts/header/header.component';
import { UserService } from '../../services/user.service';
import {
  CoachesInterface,
  LeaguesInterface,
  PlayerInterface,
  ResponseInterface,
  TeamsInterface,
  UserInterface,
  VenuesInterface,
} from '../../models/interface';
import { Router, RouterLink } from '@angular/router';
import { VenuesService } from '../../services/venues.service';
import { PlayersService } from '../../services/players.service';
import { CoachesService } from '../../services/coaches.service';
import { TeamsService } from '../../services/teams.service';
import { LeaguesService } from '../../services/leagues.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    NgOptimizedImage,
    LeaguesCardComponent,
    TeamCardComponent,
    CoachCardComponent,
    PlayerCardComponent,
    VenueCardComponent,
    MenuComponent,
    HeaderComponent,
    RouterLink,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent implements OnInit, OnDestroy {
  venuesServices = inject(VenuesService);
  errorServices = inject(ErrorHandlerService);
  loginServices = inject(UserService);
  playersServices = inject(PlayersService);
  coachesServices = inject(CoachesService);
  teamsServices = inject(TeamsService);
  leaguesServices = inject(LeaguesService);
  navigate = inject(Router);

  destroyRef = new Subject<void>();

  limitedLeagues: LeaguesInterface[] = [];
  limitedTeams: TeamsInterface[] = [];
  limitedCoach: CoachesInterface[] = [];
  limitedPlayers: PlayerInterface[] = [];
  limitedVenues: VenuesInterface[] = [];
  userData: UserInterface | null = null;

  ngOnInit() {
    this.loginServices.getLoggedUser
      .pipe(takeUntil(this.destroyRef))
      .subscribe({
        next: (el: null | UserInterface) => {
          if (el) {
            this.userData = el;
            this.leaguesServices
              .getLeagues()
              .pipe(takeUntil(this.destroyRef))
              .subscribe({
                next: (res: ResponseInterface) => {
                  const getLeagues = res.response;
                  this.limitedLeagues = getLeagues.slice(0, 5);
                },
                error: (err) => {
                  this.errorServices.errorHandleProfile(err);
                },
              });
            this.teamsServices
              .getTeams('Spain')
              .pipe(takeUntil(this.destroyRef))
              .subscribe({
                next: (res: ResponseInterface) => {
                  const getTeams = res.response;
                  this.limitedTeams = getTeams.slice(0, 5);
                },
                error: (err) => {
                  this.errorServices.errorHandleProfile(err);
                },
              });
            this.coachesServices
              .getCouches('44')
              .pipe(takeUntil(this.destroyRef))
              .subscribe({
                next: (res: ResponseInterface) => {
                  const getCoach = res.response;
                  if (getCoach.length > 5) {
                    this.limitedCoach = getCoach.slice(0, 5);
                    return;
                  }
                  this.limitedCoach = getCoach;
                },
                error: (err) => {
                  this.errorServices.errorHandleProfile(err);
                },
              });
            this.playersServices
              .getPlayers('67', '2022')
              .pipe(takeUntil(this.destroyRef))
              .subscribe({
                next: (res: ResponseInterface) => {
                  const getPlayers = res.response;
                  if (getPlayers.length > 5) {
                    this.limitedPlayers = getPlayers.slice(0, 5);
                    return;
                  }
                  this.limitedPlayers = getPlayers;
                },
                error: (err) => {
                  this.errorServices.errorHandleProfile(err);
                },
              });
            this.venuesServices
              .getVenues('Spain')
              .pipe(takeUntil(this.destroyRef))
              .subscribe({
                next: (res: ResponseInterface) => {
                  const getVenues = res.response;
                  if (getVenues.length > 5) {
                    this.limitedVenues = getVenues.slice(0, 5);
                    return;
                  }
                  this.limitedVenues = getVenues;
                },
                error: (err) => {
                  this.errorServices.errorHandleProfile(err);
                },
              });
            return;
          }
          this.navigate.navigateByUrl('/login');
        },
      });
  }

  ngOnDestroy(): void {
    this.destroyRef.next();
    this.destroyRef.complete();
  }
}
