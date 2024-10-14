import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PlayersService } from '../../services/players.service';
import { LeaguesService } from '../../services/leagues.service';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { CoachesService } from '../../services/coaches.service';
import { TeamsService } from '../../services/teams.service';
import { VenuesService } from '../../services/venues.service';
import { SavedPostsService } from '../../services/saved-posts.service';
import { ErrorToastsComponent } from '../../layouts/error-toasts/error-toasts.component';
import { WarningToastsComponent } from '../../layouts/warning-toasts/warning-toasts.component';
import { ErrorHandlerService } from '../../services/error-handler.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    HeaderComponent,
    NgxPaginationModule,
    ReactiveFormsModule,
    ErrorToastsComponent,
    WarningToastsComponent,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit, OnDestroy {
  errorServices = inject(ErrorHandlerService);
  playerServices = inject(PlayersService);
  leaguesServices = inject(LeaguesService);
  loginServices = inject(UserService);
  teamsServices = inject(TeamsService);
  venuesServices = inject(VenuesService);
  userServices = inject(UserService);
  savedServices = inject(SavedPostsService);
  navigate = inject(Router);
  coachesServices = inject(CoachesService);
  form = inject(NonNullableFormBuilder);

  playersArr: PlayerInterface[] = [];
  teamsArr: TeamsInterface[] = [];
  leaguesArr: LeaguesInterface[] = [];
  venuesArr: VenuesInterface[] = [];
  coachesArr: CoachesInterface[] = [];

  alreadyCalledCoaches: boolean = false;
  alreadyCalledTeams: boolean = false;
  alreadyCalledPlayers: boolean = false;
  alreadyCalledVenues: boolean = false;

  destroyRef = new Subject<void>();
  savesArr: SavesInterface | {} = {};
  user: UserInterface | null = null;
  category: string = 'leagues';
  errorMessage: string = '';
  show: number = 0;
  page: any;

  @ViewChild('error') errorToast!: ErrorToastsComponent;
  @ViewChild('warning') warningToast!: WarningToastsComponent;

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
      [Validators.required, Validators.minLength(4), Validators.maxLength(30)],
    ],
    newPassword: [
      '',
      [Validators.required, Validators.minLength(4), Validators.maxLength(30)],
    ],
    confirmPassword: [
      '',
      [Validators.required, Validators.minLength(4), Validators.maxLength(30)],
    ],
  });

  ngOnInit(): void {
    this.loginServices.getLoggedUser
      .pipe(takeUntil(this.destroyRef))
      .subscribe({
        next: (el: UserInterface | null) => {
          if (el) {
            this.user = el;
            this.savedServices
              .getUsersSavedById(this.user.id)
              .pipe(takeUntil(this.destroyRef))
              .subscribe({
                next: (res: SavesInterface) => {
                  this.savesArr = res;
                  if (res.leagues) {
                    res.leagues.forEach((el: string) => {
                      this.leaguesServices
                        .getLeaguesById(el)
                        .pipe(takeUntil(this.destroyRef))
                        .subscribe({
                          next: (response: ResponseInterface) => {
                            if (response.response[0]) {
                              this.leaguesArr.push(response.response[0]);
                            }
                          },
                          error: (err) => {
                            this.errorServices.errorHandlerUser(
                              err,
                              this.errorToast,
                            );
                          },
                        });
                    });
                    if (!res.leagues.length) {
                      this.errorMessage = 'You dont have liked leagues';
                    }
                  }
                },
                error: (err) => {
                  this.errorServices.errorHandlerUser(err, this.errorToast);
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

  updateEmail() {
    let used: any;
    this.userServices
      .getUsers()
      .pipe(takeUntil(this.destroyRef))
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
                this.userServices
                  .updateUserData(this.user!.id, updatedUser)
                  .pipe(takeUntil(this.destroyRef))
                  .subscribe({
                    next: (response: UserInterface) => {
                      if (response.id) {
                        this.user = response;
                        alert('Email Changed Successfully');
                      }
                    },
                    error: (err) => {
                      this.errorServices.errorHandlerUser(err, this.errorToast);
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
          this.errorServices.errorHandlerUser(err, this.errorToast);
        },
      });
  }

  updateName() {
    if (this.user?.name !== this.replaceForm.controls.name.value) {
      if (this.user && this.user.id) {
        let updatedUser = { ...this.user };
        updatedUser.name = this.replaceForm.controls.name.value;
        this.userServices
          .updateUserData(this.user!.id, updatedUser)
          .pipe(takeUntil(this.destroyRef))
          .subscribe({
            next: (response: UserInterface) => {
              if (response.id) {
                this.user = response;
                alert('Name Changed Successfully');
              }
            },
            error: (err) => {
              this.errorServices.errorHandlerUser(err, this.errorToast);
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
        this.userServices
          .updateUserData(this.user!.id, updatedUser)
          .pipe(takeUntil(this.destroyRef))
          .subscribe({
            next: (response: UserInterface) => {
              if (response.id) {
                this.user = response;
                alert('Surname Changed Successfully');
              }
            },
            error: (err) => {
              this.errorServices.errorHandlerUser(err, this.errorToast);
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
            this.userServices
              .updateUserData(this.user!.id, updatedUser)
              .pipe(takeUntil(this.destroyRef))
              .subscribe({
                next: (response: UserInterface) => {
                  if (response.id) {
                    this.user = response;
                    alert('Password Changed Successfully');
                  }
                },
                error: (err) => {
                  this.errorServices.errorHandlerUser(err, this.errorToast);
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
            this.coachesServices
              .getCoachById(el)
              .pipe(takeUntil(this.destroyRef))
              .subscribe({
                next: (response: ResponseInterface) => {
                  this.coachesArr.push(response.response[0]);
                },
                error: (err) => {
                  this.errorServices.errorHandlerUser(err, this.errorToast);
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
            this.teamsServices
              .getTeamById(el)
              .pipe(takeUntil(this.destroyRef))
              .subscribe({
                next: (response: ResponseInterface) => {
                  this.teamsArr.push(response.response[0]);
                },
                error: (err) => {
                  this.errorServices.errorHandlerUser(err, this.errorToast);
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
            this.venuesServices
              .getVenueById(el)
              .pipe(takeUntil(this.destroyRef))
              .subscribe({
                next: (response: ResponseInterface) => {
                  this.venuesArr.push(response.response[0]);
                },
                error: (err) => {
                  this.errorServices.errorHandlerUser(err, this.errorToast);
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
                .pipe(takeUntil(this.destroyRef))
                .subscribe({
                  next: (response: ResponseInterface) => {
                    this.playersArr.push(response.response[0]);
                  },
                  error: (err) => {
                    this.errorServices.errorHandlerUser(err, this.errorToast);
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
        this.savedServices
          .updateUserSaved(this.savesArr.id, this.savesArr)
          .pipe(takeUntil(this.destroyRef))
          .subscribe({
            error: (err) => {
              this.errorServices.errorHandlerUser(err, this.errorToast);
            },
          });
      }
    }
  }

  toggleProfileBox(i: number) {
    this.show = i;
  }
}
