import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HeaderComponent } from '../../layouts/header/header.component';
import { ActivatedRoute, Router } from '@angular/router';
import { PlayersService } from '../../services/players.service';
import { delay, Subject, takeUntil } from 'rxjs';
import {
  PlayerInterface,
  ResponseInterface,
  UserInterface,
} from '../../models/interface';
import { UserService } from '../../services/user.service';
import { SaveButtonComponent } from '../../layouts/save-button/save-button.component';
import { ErrorToastsComponent } from '../../layouts/error-toasts/error-toasts.component';
import { WarningToastsComponent } from '../../layouts/warning-toasts/warning-toasts.component';
import { ErrorHandlerService } from '../../services/error-handler.service';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [
    HeaderComponent,
    SaveButtonComponent,
    ErrorToastsComponent,
    WarningToastsComponent,
  ],
  templateUrl: './player.component.html',
  styleUrl: './player.component.css',
})
export class PlayerComponent implements OnInit, OnDestroy {
  errorServices = inject(ErrorHandlerService);
  playerServices = inject(PlayersService);
  loginServices = inject(UserService);
  route = inject(ActivatedRoute);
  navigation = inject(Router);

  playerId: string | null = null;
  playerSeason: string | null = null;
  player: PlayerInterface | undefined = undefined;
  userData: UserInterface | null = null;

  destroyRef = new Subject<void>();

  @ViewChild('error') errorToast!: ErrorToastsComponent;
  @ViewChild('warning') warningToast!: WarningToastsComponent;

  ngOnInit(): void {
    this.loginServices.getLoggedUser
      .pipe(takeUntil(this.destroyRef))
      .subscribe({
        next: (el: UserInterface | null) => {
          if (el) {
            this.userData = el;
            this.getPlayer();
            return;
          }
          this.navigation.navigateByUrl('/login');
        },
      });
  }

  getPlayer() {
    this.playerId = this.route.snapshot.paramMap.get('id');
    this.playerSeason = this.route.snapshot.paramMap.get('season');
    if (this.playerId && this.playerSeason) {
      this.playerServices
        .getPlayerById(this.playerId, this.playerSeason)
        .pipe(takeUntil(this.destroyRef))
        .subscribe({
          next: (res: ResponseInterface) => {
            if (res.errors.length && res.errors.plan) {
              this.errorServices
                .warningHandler(
                  'We could not get you the player,try again later',
                  this.warningToast,
                )
                .pipe(delay(3000))
                .subscribe(() => {
                  this.navigation.navigateByUrl('/players');
                });
              return;
            }
            this.player = res.response[0];
          },
          error: (err) => {
            this.errorServices.errorHandlerUser(err, this.errorToast);
          },
        });
      return;
    }
    this.navigation.navigateByUrl('/players');
    return;
  }

  ngOnDestroy(): void {
    this.destroyRef.next();
    this.destroyRef.complete();
  }
}
