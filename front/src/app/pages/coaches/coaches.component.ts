import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { HeaderComponent } from '../../layouts/header/header.component';
import { PlayersService } from '../../services/players.service';
import {
  CoachesInterface,
  CountryInterface,
  TeamsInterface,
} from '../../models/interface';
import { Subject, takeUntil } from 'rxjs';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-coaches',
  standalone: true,
  imports: [HeaderComponent, NgxPaginationModule],
  templateUrl: './coaches.component.html',
  styleUrls: ['./coaches.component.css'],
})
export class CoachesComponent implements OnInit, OnDestroy {
  playersServices = inject(PlayersService);
  couchesArr: CoachesInterface[] | [] = [];
  teamsArr: TeamsInterface[] | undefined = undefined;
  countryArr: CountryInterface[] | undefined = undefined;
  couch: CoachesInterface | undefined = undefined;
  teamName: undefined | string | number = undefined;
  countryName: undefined | string = undefined;
  page: any;
  ngUnsubscribe = new Subject<void>();
  countryErrorMessage: string | undefined = undefined;
  teamErrorMessage: string | undefined = undefined;
  couchErrorMessage: string | undefined = undefined;

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

  setTeam(team: string | number) {
    this.teamName = team;
    this.getCouches();
  }

  getCouches() {
    this.couchErrorMessage = undefined;
    if (this.teamName) {
      this.playersServices
        .getCouches(this.teamName)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: (res: any) => {
            if (res.errors.plan) {
              this.couchErrorMessage = res.errors.plan;
              console.log(res.errors.plan);
              return;
            }
            this.couchesArr = res.response;
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
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
