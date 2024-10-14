import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import { ErrorToastsComponent } from '../../layouts/error-toasts/error-toasts.component';
import { WarningToastsComponent } from '../../layouts/warning-toasts/warning-toasts.component';

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
    ErrorToastsComponent,
    WarningToastsComponent,
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

  @ViewChild('error') errorToast!: ErrorToastsComponent;
  @ViewChild('warning') warningToast!: WarningToastsComponent;

  ngOnInit() {
    this.loginServices.getLoggedUser
      .pipe(takeUntil(this.destroyRef))
      .subscribe({
        next: (el: null | UserInterface) => {
          if (el) {
            this.userData = el;
            this.getCategories();
            return;
          }
          this.navigate.navigateByUrl('/login');
        },
      });
  }

  getCategories() {
    this.leaguesServices
      .getLeagues()
      .pipe(takeUntil(this.destroyRef))
      .subscribe({
        next: (res: ResponseInterface) => {
          if (res.errors.length) {
            this.errorServices.warningHandler(
              'We could not het the leagues, try again later',
              this.warningToast,
            );
            return;
          }
          const getLeagues = res.response;
          this.limitedLeagues = getLeagues.slice(0, 5);
        },
        error: (err) => {
          this.errorServices.errorHandlerUser(err, this.errorToast);
        },
      });
    this.teamsServices
      .getTeams('Spain')
      .pipe(takeUntil(this.destroyRef))
      .subscribe({
        next: (res: ResponseInterface) => {
          if (res.errors.length) {
            this.errorServices.warningHandler(
              'We could not het the teams, try again later',
              this.warningToast,
            );
            return;
          }
          const getTeams = res.response;
          this.limitedTeams = getTeams.slice(0, 5);
        },
        error: (err) => {
          this.errorServices.errorHandlerUser(err, this.errorToast);
        },
      });
    this.coachesServices
      .getCouches('44')
      .pipe(takeUntil(this.destroyRef))
      .subscribe({
        next: (res: ResponseInterface) => {
          if (res.errors.length) {
            this.errorServices.warningHandler(
              'We could not het the coaches, try again later',
              this.warningToast,
            );
            return;
          }
          const getCoach = res.response;
          if (getCoach.length > 5) {
            this.limitedCoach = getCoach.slice(0, 5);
            return;
          }
          this.limitedCoach = getCoach;
        },
        error: (err) => {
          this.errorServices.errorHandlerUser(err, this.errorToast);
        },
      });
    this.playersServices
      .getPlayers('67', '2022')
      .pipe(takeUntil(this.destroyRef))
      .subscribe({
        next: (res: ResponseInterface) => {
          if (res.errors.length) {
            this.errorServices.warningHandler(
              'We could not het the players, try again later',
              this.warningToast,
            );
            return;
          }
          const getPlayers = res.response;
          if (getPlayers.length > 5) {
            this.limitedPlayers = getPlayers.slice(0, 5);
            return;
          }
          this.limitedPlayers = getPlayers;
        },
        error: (err) => {
          this.errorServices.errorHandlerUser(err, this.errorToast);
        },
      });
    this.venuesServices
      .getVenues('Spain')
      .pipe(takeUntil(this.destroyRef))
      .subscribe({
        next: (res: ResponseInterface) => {
          if (res.errors.length) {
            this.errorServices.warningHandler(
              'We could not het the venues, try again later',
              this.warningToast,
            );
            return;
          }
          const getVenues = res.response;
          if (getVenues.length > 5) {
            this.limitedVenues = getVenues.slice(0, 5);
            return;
          }
          this.limitedVenues = getVenues;
        },
        error: (err) => {
          this.errorServices.errorHandlerUser(err, this.errorToast);
        },
      });
    return;
  }

  ngOnDestroy(): void {
    this.destroyRef.next();
    this.destroyRef.complete();
  }
}
