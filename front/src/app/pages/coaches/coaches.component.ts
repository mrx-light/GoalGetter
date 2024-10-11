import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { HeaderComponent } from '../../layouts/header/header.component';
import { PlayersService } from '../../services/players.service';
import {
  CoachesInterface,
  CountryInterface,
  ResponseInterface,
  TeamsInterface,
  UserInterface,
} from '../../models/interface';
import { Subject, takeUntil } from 'rxjs';
import { NgxPaginationModule } from 'ngx-pagination';
import { UserService } from '../../services/user.service';
import { Router, RouterLink } from '@angular/router';
import { SaveButtonComponent } from '../../layouts/save-button/save-button.component';
import { TeamsService } from '../../services/teams.service';
import { CoachesService } from '../../services/coaches.service';

@Component({
  selector: 'app-coaches',
  standalone: true,
  imports: [
    HeaderComponent,
    NgxPaginationModule,
    SaveButtonComponent,
    RouterLink,
  ],
  templateUrl: './coaches.component.html',
  styleUrls: ['./coaches.component.css'],
})
export class CoachesComponent implements OnInit, OnDestroy {
  playersServices = inject(PlayersService);
  loginServices = inject(UserService);
  navigate = inject(Router);
  teamsServices = inject(TeamsService);
  coachesServices = inject(CoachesService);

  userData: UserInterface | null = null;
  couchesArr: CoachesInterface[] = [];
  teamsArr: TeamsInterface[] = [];
  countryArr: CountryInterface[] = [];

  teamName: undefined | string | number = undefined;
  countryName: undefined | string = undefined;
  destroyRef = new Subject<void>();
  page: any;

  countryErrorMessage: string | undefined = undefined;
  teamErrorMessage: string | undefined = undefined;
  couchErrorMessage: string | undefined = undefined;

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
      this.coachesServices
        .getCouches(this.teamName)
        .pipe(takeUntil(this.destroyRef))
        .subscribe({
          next: (res: ResponseInterface) => {
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
}
