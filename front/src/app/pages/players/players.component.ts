import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HeaderComponent } from '../../layouts/header/header.component';
import { MenuComponent } from '../../layouts/menu/menu.component';
import { PlayersService } from '../../services/players.service';
import { Subject, takeUntil } from 'rxjs';
import {
  CountryInterface,
  PlayerInterface,
  ResponseInterface,
  TeamsInterface,
  UserInterface,
} from '../../models/interface';
import { NgxPaginationModule } from 'ngx-pagination';
import { UserService } from '../../services/user.service';
import { Router, RouterLink } from '@angular/router';
import { SaveButtonComponent } from '../../layouts/save-button/save-button.component';
import { TeamsService } from '../../services/teams.service';
import { ErrorToastsComponent } from '../../layouts/error-toasts/error-toasts.component';
import { WarningToastsComponent } from '../../layouts/warning-toasts/warning-toasts.component';
import { ErrorHandlerService } from '../../services/error-handler.service';

@Component({
  selector: 'app-players',
  standalone: true,
  imports: [
    HeaderComponent,
    MenuComponent,
    NgxPaginationModule,
    SaveButtonComponent,
    RouterLink,
    ErrorToastsComponent,
    WarningToastsComponent,
  ],
  templateUrl: './players.component.html',
  styleUrl: './players.component.css',
})
export class PlayersComponent implements OnInit, OnDestroy {
  errorServices = inject(ErrorHandlerService);
  playersServices = inject(PlayersService);
  loginServices = inject(UserService);
  navigate = inject(Router);
  teamsServices = inject(TeamsService);

  countryArr: CountryInterface[] = [];
  playersArr: PlayerInterface[] = [];
  teamsArr: TeamsInterface[] = [];
  userData: UserInterface | null = null;
  seasonsArr: number[] = [];

  countryName: undefined | string = undefined;
  year: undefined | string = undefined;
  team: string | number | undefined = undefined;
  playerErrorMessage: string | undefined = undefined;
  countryErrorMessage: string | undefined = undefined;
  seasonErrorMessage: string | undefined = undefined;
  teamErrorMessage: string | undefined = undefined;

  destroyRef = new Subject<void>();
  page: any;

  @ViewChild('error') errorToast!: ErrorToastsComponent;
  @ViewChild('warning') warningToast!: WarningToastsComponent;

  ngOnInit(): void {
    this.loginServices.getLoggedUser
      .pipe(takeUntil(this.destroyRef))
      .subscribe({
        next: (el: UserInterface | null) => {
          if (el) {
            this.userData = el;
            this.getCountriesSeasons();

            return;
          }
          this.navigate.navigateByUrl('/login');
        },
      });
  }

  getCountriesSeasons() {
    this.playersServices
      .getCountry()
      .pipe(takeUntil(this.destroyRef))
      .subscribe({
        next: (res: ResponseInterface) => {
          if (res.errors && res.errors.plan) {
            this.countryErrorMessage = res.errors.plan;
            this.errorServices.warningHandler(' ', this.warningToast);
            return;
          }
          this.countryArr = res.response;
        },
        error: (err) => {
          this.errorServices.errorHandlerUser(err, this.errorToast);
        },
      });
    this.playersServices
      .getSeasons()
      .pipe(takeUntil(this.destroyRef))
      .subscribe({
        next: (res: ResponseInterface) => {
          if (res.errors && res.errors.plan) {
            this.seasonErrorMessage = res.errors.plan;
            this.errorServices.warningHandler(
              'Something went wrong, try again later',
              this.warningToast,
            );
            return;
          }
          this.seasonsArr = res.response;
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

  setCountry(country: string) {
    this.countryName = country;
    this.teamsServices
      .getTeams(country)
      .pipe(takeUntil(this.destroyRef))
      .subscribe({
        next: (res: ResponseInterface) => {
          if (res.errors && res.errors.plan) {
            this.teamErrorMessage = res.errors.plan;
            this.errorServices.warningHandler(
              'Something went wrong, try again later',
              this.warningToast,
            );
            return;
          }
          this.teamsArr = res.response;
        },
        error: (err) => {
          this.errorServices.errorHandlerUser(err, this.errorToast);
        },
      });
  }

  setTeam(team: string | number) {
    this.team = team;
    this.getPlayers();
  }

  setYear(year: number) {
    this.year = year + '';
    this.getPlayers();
  }

  sortPlayers(
    key:
      | 'id'
      | 'name'
      | 'weight'
      | 'height'
      | 'age'
      | 'yellow-card'
      | 'red-card'
      | 'duels'
      | 'goals',
  ) {
    if (this.playersArr.length) {
      this.playersArr = this.playersServices.sortPlayersBy(
        this.playersArr,
        key,
      );
    }
  }

  getPlayers() {
    this.playerErrorMessage = undefined;
    if (this.year && this.team) {
      this.playersServices
        .getPlayers(this.team, this.year)
        .pipe(takeUntil(this.destroyRef))
        .subscribe({
          next: (res: ResponseInterface) => {
            if (res.errors.length && res.errors.plan) {
              this.playerErrorMessage = res.errors.plan;
              this.errorServices.warningHandler(
                'Something went wrong, try again later',
                this.warningToast,
              );
              return;
            }
            this.playersArr = res.response;
          },
          error: (err) => {
            this.errorServices.errorHandlerUser(err, this.errorToast);
          },
        });
    }
  }
}
