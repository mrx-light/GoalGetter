import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { HeaderComponent } from '../../layouts/header/header.component';
import {
  CountryInterface,
  ResponseInterface,
  TeamsInterface,
  UserInterface,
} from '../../models/interface';
import { PlayersService } from '../../services/players.service';
import { Subject, takeUntil } from 'rxjs';
import { NgxPaginationModule } from 'ngx-pagination';
import { TeamModalComponent } from '../../layouts/team-modal/team-modal.component';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { SaveButtonComponent } from '../../layouts/save-button/save-button.component';
import { TeamsService } from '../../services/teams.service';
import { ErrorToastsComponent } from '../../layouts/error-toasts/error-toasts.component';
import { WarningToastsComponent } from '../../layouts/warning-toasts/warning-toasts.component';
import { ErrorHandlerService } from '../../services/error-handler.service';

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [
    HeaderComponent,
    NgxPaginationModule,
    TeamModalComponent,
    SaveButtonComponent,
    ErrorToastsComponent,
    WarningToastsComponent,
  ],
  templateUrl: './teams.component.html',
  styleUrl: './teams.component.css',
})
export class TeamsComponent implements OnInit, OnDestroy {
  errorServices = inject(ErrorHandlerService);
  playerServices = inject(PlayersService);
  loginServices = inject(UserService);
  teamsServices = inject(TeamsService);
  navigate = inject(Router);

  teamsArr: TeamsInterface[] = [];
  countryArray: CountryInterface[] = [];

  destroyRef = new Subject<void>();
  team: TeamsInterface | undefined = undefined;
  errorCountryMessage: string | null = null;
  errorTeamsMessage: string | null = null;
  userData: UserInterface | null = null;
  countryName: string | null = null;
  page: any;

  @ViewChildren(TeamModalComponent) modal!: TeamModalComponent;
  @ViewChild('error') errorToast!: ErrorToastsComponent;
  @ViewChild('warning') warningToast!: WarningToastsComponent;
  ngOnInit(): void {
    this.loginServices.getLoggedUser
      .pipe(takeUntil(this.destroyRef))
      .subscribe({
        next: (el: UserInterface | null) => {
          if (el) {
            this.userData = el;
            this.errorCountryMessage = null;
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
    this.playerServices
      .getCountry()
      .pipe(takeUntil(this.destroyRef))
      .subscribe({
        next: (res: ResponseInterface) => {
          if (res.errors && res.errors.plan) {
            this.errorCountryMessage = res.errors.plan;
            this.errorServices.warningHandler(' ', this.warningToast);
            console.log(res.errors.plan);
            return;
          }
          this.countryArray = res.response;
        },
        error: (err) => {
          this.errorServices.errorHandlerUser(err, this.errorToast);
        },
      });
    return;
  }

  passDataModal(obj: TeamsInterface) {
    if (this.modal) {
      this.team = obj;
    }
  }

  sortBy(
    key:
      | 'id'
      | 'name'
      | 'founded'
      | 'country'
      | 'code'
      | 'venue-capacity'
      | 'venue-name'
      | 'venue-city'
      | 'surface',
  ) {
    if (this.teamsArr && this.teamsArr.length) {
      this.teamsArr = this.teamsServices.sortTeamsBy(this.teamsArr, key);
    }
  }

  getTeams(country: string) {
    this.countryName = country;
    this.errorTeamsMessage = null;
    this.teamsServices
      .getTeams(country)
      .pipe(takeUntil(this.destroyRef))
      .subscribe({
        next: (res: ResponseInterface) => {
          if (res.errors && res.errors.plan) {
            this.errorTeamsMessage = res.errors.plan;
            this.errorServices.warningHandler(' ', this.warningToast);
            console.log(res.errors.plan);
            return;
          }
          this.teamsArr = res.response;
        },
        error: (err) => {
          this.errorServices.errorHandlerUser(err, this.errorToast);
        },
      });
  }
}
