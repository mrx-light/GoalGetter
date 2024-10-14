import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { HeaderComponent } from '../../layouts/header/header.component';
import { PlayersService } from '../../services/players.service';
import {
  CountryInterface,
  ResponseInterface,
  UserInterface,
  VenuesInterface,
} from '../../models/interface';
import { Subject, takeUntil } from 'rxjs';
import { NgxPaginationModule } from 'ngx-pagination';
import { VenueModalComponent } from '../../layouts/venue-modal/venue-modal.component';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { SaveButtonComponent } from '../../layouts/save-button/save-button.component';
import { VenuesService } from '../../services/venues.service';
import { ErrorToastsComponent } from '../../layouts/error-toasts/error-toasts.component';
import { WarningToastsComponent } from '../../layouts/warning-toasts/warning-toasts.component';
import { ErrorHandlerService } from '../../services/error-handler.service';

@Component({
  selector: 'app-venues',
  standalone: true,
  imports: [
    HeaderComponent,
    NgxPaginationModule,
    VenueModalComponent,
    SaveButtonComponent,
    ErrorToastsComponent,
    WarningToastsComponent,
  ],
  templateUrl: './venues.component.html',
  styleUrl: './venues.component.css',
})
export class VenuesComponent implements OnInit, OnDestroy {
  errorServices = inject(ErrorHandlerService);
  playerServices = inject(PlayersService);
  loginServices = inject(UserService);
  venuesServices = inject(VenuesService);
  navigate = inject(Router);

  destroyRef = new Subject<void>();
  countryArr: CountryInterface[] = [];
  venuesArr: VenuesInterface[] = [];

  venue: VenuesInterface | undefined = undefined;
  countryName: string | undefined = undefined;
  errorCountryMessage: string | null = null;
  errorVenuesMessage: string | null = null;
  userData: UserInterface | null = null;
  page: any;

  @ViewChildren(VenueModalComponent) modal!: VenueModalComponent;
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
            this.errorServices.warningHandler(
              'Something went wrong, try again later',
              this.warningToast,
            );
            this.errorCountryMessage = res.errors.plan;
            return;
          }
          this.countryArr = res.response;
        },
        error: (err) => {
          this.errorServices.errorHandlerUser(err, this.errorToast);
        },
      });
    return;
  }

  getVenues(country: string) {
    this.countryName = country;
    this.venuesServices
      .getVenues(country)
      .pipe(takeUntil(this.destroyRef))
      .subscribe({
        next: (res: ResponseInterface) => {
          if (res.errors && res.errors.plan) {
            this.errorServices.warningHandler(
              'Something went wrong, try again later',
              this.warningToast,
            );
            this.errorVenuesMessage = res.errors.plan;
            return;
          }
          if (!res.response.length) {
            this.errorVenuesMessage = 'There are no Coaches';
            return;
          }
          this.venuesArr = res.response;
        },
        error: (err) => {
          this.errorServices.errorHandlerUser(err, this.errorToast);
        },
      });
  }

  passDataModal(obj: VenuesInterface) {
    if (this.modal) {
      this.venue = obj;
    }
  }

  sortBy(id: string) {
    alert(id);
  }
}
