import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { HeaderComponent } from '../../layouts/header/header.component';
import {
  CoachesInterface,
  LeaguesInterface,
  PlayerInterface,
  ResponseInterface,
  SavesInterface,
  TeamsInterface,
  UserInterface,
  VenuesInterface,
} from '../../models/interface';
import { NgxPaginationModule } from 'ngx-pagination';
import { ProfileService } from '../../services/profile.service';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PlayersService } from '../../services/players.service';
import { LeaguesService } from '../../services/leagues.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [HeaderComponent, NgxPaginationModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit, OnDestroy {
  playersArr: PlayerInterface[] = [];
  teamsArr: TeamsInterface[] = [];
  leaguesArr: LeaguesInterface[] = [];
  venuesArr: VenuesInterface[] = [];
  coachesArr: CoachesInterface[] = [];

  alreadyCalledCoaches: boolean = false;
  alreadyCalledTeams: boolean = false;
  alreadyCalledPlayers: boolean = false;
  alreadyCalledVenues: boolean = false;

  errorMessage: string = '';
  user: UserInterface | null = null;
  page: any;
  ngUnsubscribe = new Subject<void>();
  category: string = 'leagues';
  profile = inject(ProfileService);
  playerServices = inject(PlayersService);
  leaguesServices = inject(LeaguesService);
  form = inject(NonNullableFormBuilder);
  replaceForm = this.form.group({
    name: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(30)],
    ],
    surname: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(30)],
    ],
    email: ['', [Validators.required, Validators.email]],
    oldPassword: [
      '',
      [Validators.required, Validators.minLength(6), Validators.maxLength(30)],
    ],
    newPassword: [
      '',
      [Validators.required, Validators.minLength(6), Validators.maxLength(30)],
    ],
    confirmPassword: [
      '',
      [Validators.required, Validators.minLength(6), Validators.maxLength(30)],
    ],
  });
  savesArr: SavesInterface | {} = {};
  show: number = 0;

  updateEmail() {
    let used: any;
    this.profile
      .getUsers()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res: UserInterface[]) => {
          if (res) {
            used = res.find((el: UserInterface) => {
              return el.email == this.replaceForm.controls.email.value;
            });
            if (!used) {
              if (this.user && this.user.id) {
                let updatedUser = { ...this.user };
                updatedUser.email = this.replaceForm.controls.email.value;
                this.profile
                  .updateUserData(this.user!.id, updatedUser)
                  .pipe(takeUntil(this.ngUnsubscribe))
                  .subscribe({
                    next: (response: UserInterface) => {
                      if (response.id) {
                        this.user = response;
                        alert('Email Changed Successfully');
                      }
                    },
                  });
                return;
              }
            }
            this.replaceForm.controls.email.setErrors({
              used: 'This email is already used',
            });
          }
        },
        error: (err) => {
          console.log('worked', err);
        },
      });
  }

  updateName() {
    if (this.user?.name !== this.replaceForm.controls.name.value) {
      if (this.user && this.user.id) {
        let updatedUser = { ...this.user };
        updatedUser.name = this.replaceForm.controls.name.value;
        this.profile
          .updateUserData(this.user!.id, updatedUser)
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe({
            next: (response: UserInterface) => {
              if (response.id) {
                this.user = response;
                alert('Name Changed Successfully');
              }
            },
          });
        return;
      }
    }
    this.replaceForm.controls.name.setErrors({
      used: 'You already have this name',
    });
  }

  updateSurname() {
    if (this.user?.surname !== this.replaceForm.controls.surname.value) {
      if (this.user && this.user.id) {
        let updatedUser = { ...this.user };
        updatedUser.surname = this.replaceForm.controls.surname.value;
        this.profile
          .updateUserData(this.user!.id, updatedUser)
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe({
            next: (response: UserInterface) => {
              if (response.id) {
                this.user = response;
                alert('Surname Changed Successfully');
              }
            },
          });
        return;
      }
    }
    this.replaceForm.controls.surname.setErrors({
      used: 'You already have this surname',
    });
  }

  updatePassword() {
    if (this.user && this.user.id) {
      if (this.user?.password == this.replaceForm.controls.oldPassword.value) {
        if (
          this.replaceForm.controls.newPassword.value ==
          this.replaceForm.controls.confirmPassword.value
        ) {
          if (
            this.user.password !==
            this.replaceForm.controls.confirmPassword.value
          ) {
            let updatedUser = { ...this.user };
            updatedUser.password =
              this.replaceForm.controls.confirmPassword.value;
            this.profile
              .updateUserData(this.user!.id, updatedUser)
              .pipe(takeUntil(this.ngUnsubscribe))
              .subscribe({
                next: (response: UserInterface) => {
                  if (response.id) {
                    this.user = response;
                    alert('Password Changed Successfully');
                  }
                },
              });
            return;
          }

          this.replaceForm.controls.confirmPassword.setErrors({
            used: 'You Already have this password',
          });
          return;
        }
        this.replaceForm.controls.confirmPassword.setErrors({
          used: 'The confirm password is different',
        });
        return;
      }
      this.replaceForm.controls.oldPassword.setErrors({
        used: 'The password is incorrect',
      });
      return;
    }
  }

  setCategory(val: string) {
    this.errorMessage = '';
    this.category = val;
    if (val === 'coaches') {
      if ('coaches' in this.savesArr && this.savesArr?.coaches.length) {
        if (!this.alreadyCalledCoaches) {
          this.alreadyCalledCoaches = true;
          this.savesArr.coaches.forEach((el: string) => {
            this.playerServices
              .getCoachBy(el)
              .pipe(takeUntil(this.ngUnsubscribe))
              .subscribe({
                next: (response: ResponseInterface) => {
                  this.coachesArr.push(response.response[0]);
                },
              });
          });
        }
        return;
      }
      this.errorMessage = 'You dont have liked coaches';
      return;
    }
    if (val === 'teams') {
      if ('teams' in this.savesArr && this.savesArr?.teams.length) {
        if (!this.alreadyCalledTeams) {
          this.alreadyCalledTeams = true;
          this.savesArr.teams.forEach((el: string) => {
            this.playerServices
              .getTeamById(el)
              .pipe(takeUntil(this.ngUnsubscribe))
              .subscribe({
                next: (response: ResponseInterface) => {
                  this.teamsArr.push(response.response[0]);
                },
              });
          });
        }
        return;
      }
      this.errorMessage = 'You dont have liked teams';
      return;
    }
    if (val === 'venues') {
      if ('venues' in this.savesArr && this.savesArr?.venues.length) {
        if (!this.alreadyCalledVenues) {
          this.alreadyCalledVenues = true;
          this.savesArr.venues.forEach((el: string) => {
            this.playerServices
              .getVenueById(el)
              .pipe(takeUntil(this.ngUnsubscribe))
              .subscribe({
                next: (response: ResponseInterface) => {
                  this.venuesArr.push(response.response[0]);
                },
              });
          });
        }
        return;
      }
      this.errorMessage = 'You dont have liked venues';
      return;
    }
    if (val === 'players') {
      if ('players' in this.savesArr && this.savesArr?.players.length) {
        if (!this.alreadyCalledPlayers) {
          this.alreadyCalledPlayers = true;
          this.savesArr.players.forEach(
            (el: { id: string; season: string }) => {
              this.playerServices
                .getPlayerById(el.id, el.season)
                .pipe(takeUntil(this.ngUnsubscribe))
                .subscribe({
                  next: (response: ResponseInterface) => {
                    this.playersArr.push(response.response[0]);
                  },
                });
            },
          );
        }
        return;
      }
      this.errorMessage = 'You dont have liked players';
      return;
    }
    if (
      val === 'leagues' &&
      'leagues' in this.savesArr &&
      !this.savesArr.leagues.length
    ) {
      this.errorMessage = 'You dont have liked leagues';
      return;
    }
  }

  removeSaved(id: string) {
    if (this.savesArr) {
      if (this.category === 'leagues') {
        if ('leagues' in this.savesArr) {
          this.savesArr.leagues = this.savesArr.leagues.filter((el: string) => {
            return el !== id;
          });
          this.leaguesArr = this.leaguesArr.filter((el) => {
            return el.league.id !== +id;
          });
        }
      }
      if (this.category === 'players') {
        if ('players' in this.savesArr) {
          this.savesArr.players = this.savesArr.players.filter(
            (el: { id: string; season: string }) => {
              return el.id !== id;
            },
          );
          this.playersArr = this.playersArr.filter((el) => {
            return el.player.id !== +id;
          });
        }
      }
      if (this.category === 'venues') {
        if ('venues' in this.savesArr) {
          this.savesArr.venues = this.savesArr.venues.filter((el: string) => {
            return el !== id;
          });
          this.venuesArr = this.venuesArr.filter((el) => {
            return el.id !== +id;
          });
        }
      }
      if (this.category === 'teams') {
        if ('teams' in this.savesArr) {
          this.savesArr.teams = this.savesArr.teams.filter((el: string) => {
            return el !== id;
          });
          this.teamsArr = this.teamsArr.filter((el) => {
            return el.team.id !== +id;
          });
        }
      }
      if (this.category === 'coaches') {
        if ('coaches' in this.savesArr) {
          this.savesArr.coaches = this.savesArr.coaches.filter((el: string) => {
            return el !== id;
          });
          this.coachesArr = this.coachesArr.filter((el) => {
            return el.id !== +id;
          });
        }
      }
      if ('id' in this.savesArr && this.savesArr?.id) {
        this.profile
          .updateUserSaved(this.savesArr.id, this.savesArr)
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe();
      }
    }
  }

  toggleProfileBox(i: number) {
    this.show = i;
  }

  ngOnInit(): void {
    this.profile
      .getUser('mrx_light')
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res: UserInterface) => {
          this.user = res;
        },
      });
    this.profile
      .getUsersSavedById('mrx_light')
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res: SavesInterface) => {
          this.savesArr = res;
          if (res.leagues) {
            res.leagues.forEach((el: string) => {
              this.leaguesServices
                .getLeaguesById(el)
                .pipe(takeUntil(this.ngUnsubscribe))
                .subscribe({
                  next: (response: ResponseInterface) => {
                    this.leaguesArr.push(response.response[0]);
                  },
                });
            });
            if (!res.leagues.length) {
              this.errorMessage = 'You dont have liked leagues';
            }
          }
        },
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
