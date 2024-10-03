import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { HeaderComponent } from '../../layouts/header/header.component';
import { MenuComponent } from '../../layouts/menu/menu.component';
import { PlayersService } from '../../services/players.service';
import { Subject, takeUntil } from 'rxjs';
import {
  CountryInterface,
  PlayerInterface,
  TeamsInterface,
} from '../../models/interface';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-players',
  standalone: true,
  imports: [HeaderComponent, MenuComponent, NgxPaginationModule],
  templateUrl: './players.component.html',
  styleUrl: './players.component.css',
})
export class PlayersComponent implements OnInit, OnDestroy {
  playersServices = inject(PlayersService);
  ngUnsubscribe = new Subject<void>();
  countryArr: CountryInterface[] | undefined = undefined;
  seasonsArr: number[] | undefined = undefined;
  teamsArr: TeamsInterface[] | undefined = undefined;
  countryName: undefined | string = undefined;
  year: undefined | string = undefined;
  team: string | number | undefined = undefined;
  playersArr: PlayerInterface[] | [] = [];
  playerErrorMessage: string | undefined = undefined;
  countryErrorMessage: string | undefined = undefined;
  seasonErrorMessage: string | undefined = undefined;
  teamErrorMessage: string | undefined = undefined;

  setCountry(country: string) {
    this.countryName = country;
    this.playersServices
      .getTeams(country)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res: any) => {
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
  page: any;

  setTeam(team: string | number) {
    this.team = team;
    this.getPlayers();
  }

  setYear(year: number) {
    this.year = year + '';
    this.getPlayers();
  }
  sortPlayers(key: any) {
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
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: (res: any) => {
            if (res.errors.plan) {
              this.playerErrorMessage = res.errors.plan;
              console.log(res.errors.plan);
              return;
            }
            this.playersArr = res.response;
          },
          error: (err: any) => {
            console.error('Something went wrong', err);
          },
        });
    }
  }

  ngOnInit(): void {
    this.playersServices
      .getCountry()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res: any) => {
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
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res: any) => {
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
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
