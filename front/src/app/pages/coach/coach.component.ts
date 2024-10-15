import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HeaderComponent } from '../../layouts/header/header.component';
import { ActivatedRoute, Router } from '@angular/router';
import { delay, Subject, takeUntil } from 'rxjs';
import {
  CoachesInterface,
  ResponseInterface,
  UserInterface,
} from '../../models/interface';
import { UserService } from '../../services/user.service';
import { SaveButtonComponent } from '../../layouts/save-button/save-button.component';
import { CoachesService } from '../../services/coaches.service';
import { ErrorToastsComponent } from '../../layouts/error-toasts/error-toasts.component';
import { WarningToastsComponent } from '../../layouts/warning-toasts/warning-toasts.component';
import { ErrorHandlerService } from '../../services/error-handler.service';

@Component({
  selector: 'app-coach',
  standalone: true,
  imports: [
    HeaderComponent,
    SaveButtonComponent,
    ErrorToastsComponent,
    WarningToastsComponent,
  ],
  templateUrl: './coach.component.html',
  styleUrls: ['./coach.component.css', './../player/player.component.css'],
})
export class CoachComponent implements OnInit, OnDestroy {
  route = inject(ActivatedRoute);
  navigate = inject(Router);
  loginServices = inject(UserService);
  coachesServices = inject(CoachesService);
  errorServices = inject(ErrorHandlerService);

  destroyRef = new Subject<void>();
  couchId: string | null = null;
  couch: CoachesInterface | null = null;
  userData: UserInterface | null = null;

  @ViewChild('error') errorToast!: ErrorToastsComponent;
  @ViewChild('warning') warningToast!: WarningToastsComponent;

  ngOnInit(): void {
    this.loginServices.getLoggedUser
      .pipe(takeUntil(this.destroyRef))
      .subscribe({
        next: (user: UserInterface | null) => {
          if (user) {
            this.userData = user;
            this.getCoach();
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
  getCoach() {
    this.couchId = this.route.snapshot.paramMap.get('id');
    if (this.couchId) {
      this.coachesServices
        .getCoachById(this.couchId)
        .pipe(takeUntil(this.destroyRef))
        .subscribe({
          next: (response: ResponseInterface) => {
            if (response.errors && response.errors.plan) {
              this.errorServices
                .warningHandler(response.errors.plan, this.warningToast)
                .pipe(delay(3000))
                .subscribe(() => {
                  this.navigate.navigateByUrl('/coaches');
                });
              return;
            }
            if (!response.response.length) {
              this.errorServices
                .warningHandler('We could not get the coach', this.warningToast)
                .pipe(delay(3000))
                .subscribe(() => {
                  this.navigate.navigateByUrl('/coaches');
                });
              return;
            }
            this.couch = response.response[0];
          },
          error: (err) => {
            this.errorServices.errorHandlerUser(err, this.errorToast);
          },
        });
      return;
    }
    this.navigate.navigateByUrl('/couches');
    return;
  }
}
