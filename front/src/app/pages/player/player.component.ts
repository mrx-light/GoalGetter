import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { HeaderComponent } from '../../layouts/header/header.component';
import { ActivatedRoute, Router } from '@angular/router';
import { PlayersService } from '../../services/players.service';
import { Subject, takeUntil } from 'rxjs';
import {
  PlayerInterface,
  ResponseInterface,
  UserInterface,
} from '../../models/interface';
import { UserService } from '../../services/user.service';
import { SaveButtonComponent } from '../../layouts/save-button/save-button.component';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [HeaderComponent, SaveButtonComponent],
  templateUrl: './player.component.html',
  styleUrl: './player.component.css',
})
export class PlayerComponent implements OnInit, OnDestroy {
  playerServices = inject(PlayersService);
  loginServices = inject(UserService);
  route = inject(ActivatedRoute);
  navigation = inject(Router);

  playerId: string | null = null;
  playerSeason: string | null = null;
  player: PlayerInterface | undefined = undefined;
  userData: UserInterface | null = null;

  destroyRef = new Subject<void>();

  ngOnInit(): void {
    this.loginServices.getLoggedUser
      .pipe(takeUntil(this.destroyRef))
      .subscribe({
        next: (el: UserInterface | null) => {
          if (el) {
            this.userData = el;
            this.playerId = this.route.snapshot.paramMap.get('id');
            this.playerSeason = this.route.snapshot.paramMap.get('season');
            if (this.playerId && this.playerSeason) {
              this.playerServices
                .getPlayerById(this.playerId, this.playerSeason)
                .pipe(takeUntil(this.destroyRef))
                .subscribe({
                  next: (res: ResponseInterface) => {
                    console.log('res: ', res);
                    if (res.errors && res.errors.plan) {
                      this.navigation.navigateByUrl('/players');
                      return;
                    }
                    this.player = res.response[0];
                    console.log(this.player);
                  },
                  error: (err) => {
                    console.error(err);
                  },
                });
              return;
            }
            this.navigation.navigateByUrl('/players');
            return;
          }
          this.navigation.navigateByUrl('/login');
        },
      });
  }

  ngOnDestroy(): void {
    this.destroyRef.next();
    this.destroyRef.complete();
  }
}
