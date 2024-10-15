import { Component, inject, OnDestroy, ViewChild } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { Router } from '@angular/router';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { Subject, takeUntil } from 'rxjs';
import { SavesInterface, UserInterface } from '../../models/interface';
import { HeaderComponent } from '../../layouts/header/header.component';
import { UserService } from '../../services/user.service';
import { SavedPostsService } from '../../services/saved-posts.service';
import { ErrorToastsComponent } from '../../layouts/error-toasts/error-toasts.component';
import { WarningToastsComponent } from '../../layouts/warning-toasts/warning-toasts.component';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    JsonPipe,
    HeaderComponent,
    ErrorToastsComponent,
    WarningToastsComponent,
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css',
})
export class RegistrationComponent implements OnDestroy {
  form = inject(NonNullableFormBuilder);
  errorServices = inject(ErrorHandlerService);
  savedServices = inject(SavedPostsService);
  userServices = inject(UserService);
  router = inject(Router);

  @ViewChild('error') errorToast!: ErrorToastsComponent;
  @ViewChild('warning') warningToast!: WarningToastsComponent;

  destroyRef = new Subject<void>();
  registrationForm = this.form.group({
    id: [
      '',
      [Validators.required, Validators.minLength(4), Validators.maxLength(20)],
    ],
    name: [
      '',
      [Validators.required, Validators.minLength(4), Validators.maxLength(20)],
    ],
    surname: [
      '',
      [Validators.required, Validators.minLength(4), Validators.maxLength(20)],
    ],
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [Validators.required, Validators.minLength(4), Validators.maxLength(20)],
    ],
    confirmPassword: [
      '',
      [Validators.required, Validators.minLength(4), Validators.maxLength(20)],
    ],
  });

  addUser() {
    if (this.registrationForm.valid) {
      this.userServices
        .getUserByEmail(this.registrationForm.controls.email.value)
        .pipe(takeUntil(this.destroyRef))
        .subscribe({
          next: (res: UserInterface[]) => {
            if (!res.length) {
              this.userServices
                .getUserById(this.registrationForm.controls.id.value)
                .pipe(takeUntil(this.destroyRef))
                .subscribe({
                  next: (el: UserInterface) => {
                    if (!el.id) {
                      if (
                        this.registrationForm.controls.password.value ===
                        this.registrationForm.controls.confirmPassword.value
                      ) {
                        let obj: any = this.registrationForm.getRawValue();
                        delete obj.confirmPassword;
                        obj.isActive = false;
                        this.userServices
                          .registryUser(obj)
                          .pipe(takeUntil(this.destroyRef))
                          .subscribe({
                            next: () => {},
                            error: (err) => {
                              this.errorServices.errorHandlerUser(
                                err,
                                this.errorToast,
                              );
                            },
                          });
                        let userSaves: SavesInterface = {
                          id: this.registrationForm.controls.id.value,
                          leagues: [],
                          teams: [],
                          players: [],
                          coaches: [],
                          venues: [],
                        };
                        this.savedServices
                          .addUserToSaves(userSaves)
                          .pipe(takeUntil(this.destroyRef))
                          .subscribe({
                            next: () => {
                              alert('You were registered');
                              this.router.navigateByUrl('/login');
                            },
                            error: (err) => {
                              this.errorServices.errorHandlerUser(
                                err,
                                this.errorToast,
                              );
                            },
                          });
                        return;
                      }
                      this.registrationForm.controls.confirmPassword.setErrors({
                        passwordCheck: 'Password are different',
                      });
                      return;
                    }
                    this.registrationForm.controls.id.setErrors({
                      idCheck: 'There is already such username',
                    });
                  },
                  error: (err) => {
                    this.errorServices.errorHandlerUser(err, this.errorToast);
                  },
                });
              return;
            }
            this.registrationForm.controls.email.setErrors({
              checkEmail: 'There is already such email',
            });
          },
          error: (err) => {
            this.errorServices.errorHandlerUser(err, this.errorToast);
          },
        });
    }
  }
  ngOnDestroy() {
    this.destroyRef.next();
    this.destroyRef.complete();
  }
}
