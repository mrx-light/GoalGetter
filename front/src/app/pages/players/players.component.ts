import { Component, inject, OnDestroy, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-players',
  standalone: true,
  imports: [
    HeaderComponent,
    MenuComponent,
    NgxPaginationModule,
    SaveButtonComponent,
    RouterLink,
  ],
  templateUrl: './players.component.html',
  styleUrl: './players.component.css',
})
export class PlayersComponent implements OnInit, OnDestroy {
  playersServices = inject(PlayersService);
  loginServices = inject(UserService);
  navigate = inject(Router);
  teamsServices = inject(TeamsService);

  countryArr: CountryInterface[] = [];
  playersArr: PlayerInterface[] = [];
  teamsArr: TeamsInterface[] = [];
  userData: UserInterface | null = null;
  seasonsArr: number[] | undefined = undefined;

  countryName: undefined | string = undefined;
  year: undefined | string = undefined;
  team: string | number | undefined = undefined;
  playerErrorMessage: string | undefined = undefined;
  countryErrorMessage: string | undefined = undefined;
  seasonErrorMessage: string | undefined = undefined;
  teamErrorMessage: string | undefined = undefined;

  page: any;
  destroyRef = new Subject<void>();

  ngOnInit(): void {
    this.loginServices.getLoggedUser
      .pipe(takeUntil(this.destroyRef))
      .subscribe({
        next: (el: UserInterface | null) => {
          if (el) {
            this.userData = el;
            this.playersServices
              .getCountry()
              .pipe(takeUntil(this.destroyRef))
              .subscribe({
                next: (res: ResponseInterface) => {
                  if (res.errors.plan) {
                    this.countryErrorMessage = res.errors.plan;
                    console.log(res.errors.plan);
                    return;
                  }
                  this.countryArr = res.response;
                },
                error: (err) => {
                  console.error(err);
                },
              });
            this.playersServices
              .getSeasons()
              .pipe(takeUntil(this.destroyRef))
              .subscribe({
                next: (res: ResponseInterface) => {
                  if (res.errors.plan) {
                    this.seasonErrorMessage = res.errors.plan;
                    console.log(res.errors.plan);
                    return;
                  }
                  this.seasonsArr = res.response;
                },
                error: (err) => {
                  console.error(err);
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

  setCountry(country: string) {
    this.countryName = country;
    this.teamsServices
      .getTeams(country)
      .pipe(takeUntil(this.destroyRef))
      .subscribe({
        next: (res: ResponseInterface) => {
          if (res.errors.plan) {
            this.teamErrorMessage = res.errors.plan;
            console.log(res.errors.plan);
            return;
          }
          this.teamsArr = res.response;
        },
        error: (err) => {
          console.error(err);
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
            if (res.errors.plan) {
              this.playerErrorMessage = res.errors.plan;
              console.log(res.errors.plan);
              return;
            }
            this.playersArr = res.response;
          },
          error: (err) => {
            console.error('Something went wrong', err);
          },
        });
    }
  }
}
