import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  ViewChildren,
} from '@angular/core';
import { HeaderComponent } from '../../layouts/header/header.component';
import { PlayersService } from '../../services/players.service';
import { CountryInterface, VenuesInterface } from '../../models/interface';
import { Subject, takeUntil } from 'rxjs';
import { NgxPaginationModule } from 'ngx-pagination';
import { VenueModalComponent } from '../../layouts/venue-modal/venue-modal.component';

@Component({
  selector: 'app-venues',
  standalone: true,
  imports: [HeaderComponent, NgxPaginationModule, VenueModalComponent],
  templateUrl: './venues.component.html',
  styleUrl: './venues.component.css',
})
export class VenuesComponent implements OnInit, OnDestroy {
  playerServices = inject(PlayersService);
  venuesArr: VenuesInterface[] | [] = [];
  countryArr: CountryInterface[] | [] = [];
  ngUnsubscribe = new Subject<void>();
  errorCountryMessage: string | null = null;
  errorVenuesMessage: string | null = null;
  page: any;
  venue: VenuesInterface | undefined = undefined;
  countryName: string | undefined = undefined;
  @ViewChildren(VenueModalComponent) modal!: VenueModalComponent;
  getVenues(country: string) {
    this.countryName = country;
    this.playerServices
      .getVenues(country)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res: any) => {
          if (res.errors && res.errors.plan) {
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
          console.error(err);
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
  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.errorCountryMessage = null;
    this.playerServices
      .getCountry()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res: any) => {
          if (res.errors && res.errors.plan) {
            this.errorCountryMessage = res.errors.plan;
            return;
          }
          this.countryArr = res.response;
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }
}
