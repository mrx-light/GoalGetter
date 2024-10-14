import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import { ErrorToastsComponent } from '../../layouts/error-toasts/error-toasts.component';
import { WarningToastsComponent } from '../../layouts/warning-toasts/warning-toasts.component';
import { ErrorHandlerService } from '../../services/error-handler.service';

@Component({
  selector: 'app-coaches',
  standalone: true,
  imports: [
    HeaderComponent,
    NgxPaginationModule,
    SaveButtonComponent,
    RouterLink,
    ErrorToastsComponent,
    WarningToastsComponent,
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
  errorServices = inject(ErrorHandlerService);

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

  @ViewChild('error') errorToast!: ErrorToastsComponent;
  @ViewChild('warning') warningToast!: WarningToastsComponent;

  ngOnInit(): void {
    this.loginServices.getLoggedUser
      .pipe(takeUntil(this.destroyRef))
      .subscribe({
        next: (el: UserInterface | null) => {
          if (el) {
            this.userData = el;
            this.getCountries();
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

  getCountries() {
    this.teamErrorMessage = 'Select a country';
    this.couchErrorMessage = 'Select a country and a team';
    this.playersServices
      .getCountry()
      .pipe(takeUntil(this.destroyRef))
      .subscribe({
        next: (res: any) => {
          if (res.errors.plan && res.errors) {
            this.countryErrorMessage = res.errors.plan;
            this.errorServices.warningHandler(
              'We could not get the countries',
              this.errorToast,
            );
            return;
          }
          this.countryArr = res.response;
          if (this.countryArr.length == 0)
            this.countryErrorMessage = 'Something went wrong';
        },
        error: (err) => {
          this.errorServices.errorHandlerUser(err, this.errorToast);
        },
      });
    return;
  }

  setCountry(country: string) {
    this.teamErrorMessage = '';
    this.countryName = country;
    this.teamsServices
      .getTeams(country)
      .pipe(takeUntil(this.destroyRef))
      .subscribe({
        next: (res: ResponseInterface) => {
          if (res.errors.plan && res.errors) {
            this.teamErrorMessage = res.errors.plan;
            return;
          }
          this.teamsArr = res.response;
          if (this.teamsArr.length == 0)
            this.teamErrorMessage = 'Something went wrong';
        },
        error: (err) => {
          this.errorServices.errorHandlerUser(err, this.errorToast);
        },
      });
  }

  setTeam(team: string | number) {
    this.teamErrorMessage = '';
    this.couchErrorMessage = '';
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
            if (res.errors.plan && res.errors) {
              this.couchErrorMessage = res.errors.plan;
              this.errorServices.warningHandler(
                'We could not get the coaches',
                this.errorToast,
              );
              return;
            }
            this.couchesArr = res.response;
            if (this.couchesArr.length == 0)
              this.couchErrorMessage = 'Something went wrong';
          },
          error: (err: any) => {
            this.errorServices.errorHandlerUser(err, this.errorToast);
          },
        });
    }
  }
}
