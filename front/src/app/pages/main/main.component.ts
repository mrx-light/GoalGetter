import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { PassDataService } from '../../services/pass-data.service';
import { NgOptimizedImage } from '@angular/common';
import { MainService } from '../../services/main.service';
import { LeaguesCardComponent } from '../../components/leagues-card/leagues-card.component';
import { TeamCardComponent } from '../../components/team-card/team-card.component';
import { CoachCardComponent } from '../../components/coach-card/coach-card.component';
import { PlayerCardComponent } from '../../components/player-card/player-card.component';
import { VenueCardComponent } from '../../components/venue-card/venue-card.component';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { Subject, takeUntil } from 'rxjs';
import { MenuComponent } from '../../layouts/menu/menu.component';
import { HeaderComponent } from '../../layouts/header/header.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    NgOptimizedImage,
    LeaguesCardComponent,
    TeamCardComponent,
    CoachCardComponent,
    PlayerCardComponent,
    VenueCardComponent,
    MenuComponent,
    HeaderComponent,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent implements OnInit, OnDestroy {
  passData = inject(PassDataService);
  profileServices = inject(MainService);
  errorServices = inject(ErrorHandlerService);
  private ngUnsubscribe = new Subject<void>();
  limitedLeagues = [];
  limitedTeams = [];
  limitedCoach = [];
  limitedPlayers = [];
  limitedVenues = [];
  ngOnInit() {
    this.profileServices
      .getLeagues()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res: any) => {
          this.passData.setLeagues(res.response);
          const getLeagues = this.passData.getLeagues.source._value;
          this.limitedLeagues = getLeagues.slice(0, 5);
        },
        error: (err) => {
          this.errorServices.errorHandleProfile(err);
        },
      });
    this.profileServices
      .getTeams()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res: any) => {
          this.passData.setTeams(res.response);
          const getTeams = this.passData.getTeams.source._value;
          this.limitedTeams = getTeams.slice(0, 5);
        },
        error: (err) => {
          this.errorServices.errorHandleProfile(err);
        },
      });
    this.profileServices
      .getCouches()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res: any) => {
          this.passData.setCoach(res.response);
          const getCoach = this.passData.getCoachs.source._value;
          if (getCoach.length > 5) {
            this.limitedCoach = getCoach.slice(0, 5);
            return;
          }
          this.limitedCoach = getCoach;
        },
        error: (err) => {
          this.errorServices.errorHandleProfile(err);
        },
      });
    this.profileServices
      .getPlayers()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res: any) => {
          this.passData.setPlayers(res.response);
          const getPlayers = this.passData.getPlayers.source._value;
          if (getPlayers.length > 5) {
            this.limitedPlayers = getPlayers.slice(0, 5);
            return;
          }
          this.limitedPlayers = getPlayers;
        },
        error: (err) => {
          this.errorServices.errorHandleProfile(err);
        },
      });
    this.profileServices
      .getVenues()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res: any) => {
          this.passData.setVenues(res.response);
          const getVenues = this.passData.getVenues.source._value;
          if (getVenues.length > 5) {
            this.limitedVenues = getVenues.slice(0, 5);
            return;
          }
          this.limitedVenues = getVenues;
        },
        error: (err) => {
          this.errorServices.errorHandleProfile(err);
        },
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
