import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  ViewChildren,
} from '@angular/core';
import { HeaderComponent } from '../../layouts/header/header.component';
import { CountryInterface, TeamsInterface } from '../../models/interface';
import { PlayersService } from '../../services/players.service';
import { Subject, takeUntil } from 'rxjs';
import { NgxPaginationModule } from 'ngx-pagination';
import { TeamModalComponent } from '../../layouts/team-modal/team-modal.component';

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [HeaderComponent, NgxPaginationModule, TeamModalComponent],
  templateUrl: './teams.component.html',
  styleUrl: './teams.component.css',
})
export class TeamsComponent implements OnInit, OnDestroy {
  playerServices = inject(PlayersService);

  teamsArr: TeamsInterface[] | [] = [];
  countryArray: CountryInterface[] | [] = [];
  countryName: string | null = null;
  ngUnsubscribe = new Subject<void>();
  errorTeamsMessage: string | null = null;
  errorCountryMessage: string | null = null;
  page: any;
  team: TeamsInterface | undefined = undefined;
  @ViewChildren(TeamModalComponent) modal!: TeamModalComponent;

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
      this.teamsArr = this.playerServices.sortTeamsBy(this.teamsArr, key);
    }
  }

  getTeams(country: string) {
    this.countryName = country;
    this.errorTeamsMessage = null;
    this.playerServices
      .getTeams(country)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res: any) => {
          console.log(res);
          if (res.errors && res.errors.plan) {
            this.errorTeamsMessage = res.errors.plan;
            console.log(res.errors.plan);
            return;
          }
          this.teamsArr = res.response;
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  ngOnInit(): void {
    this.errorCountryMessage = null;
    this.playerServices
      .getCountry()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res: any) => {
          console.log(res);
          if (res.errors && res.errors.plan) {
            this.errorCountryMessage = res.errors.plan;
            console.log(res.errors.plan);
            return;
          }
          this.countryArray = res.response;
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }
  ngOnDestroy(): void {}
}
