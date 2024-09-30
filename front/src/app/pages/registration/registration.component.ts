import { Component, inject, OnDestroy } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RegistrationService } from '../../services/registration.service';
import { JsonPipe } from '@angular/common';
import { Router } from '@angular/router';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css',
})
export class RegistrationComponent implements OnDestroy {
  form = inject(NonNullableFormBuilder);
  errorServices = inject(ErrorHandlerService);
  registrationServices = inject(RegistrationService);
  router = inject(Router);
  ngUnsubscribe = new Subject<void>();
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
      this.registrationServices
        .getUserByEmail(this.registrationForm.controls.email.value)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: (res: any) => {
            if (!res.length) {
              this.registrationServices
                .getUserByUsername(this.registrationForm.controls.id.value)
                .pipe(takeUntil(this.ngUnsubscribe))
                .subscribe({
                  next: (el: any) => {
                    if (!el.length) {
                      if (
                        this.registrationForm.controls.password.value ===
                        this.registrationForm.controls.confirmPassword.value
                      ) {
                        let obj: any = this.registrationForm.getRawValue();
                        delete obj.confirmPassword;
                        obj.isActive = false;
                        this.registrationServices
                          .registryUser(obj)
                          .pipe(takeUntil(this.ngUnsubscribe))
                          .subscribe({
                            error: (err) => {
                              this.errorServices.handle(err);
                            },
                          });
                        alert('You were registered');
                        this.router.navigateByUrl('/login');
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
                    this.errorServices.handle(err);
                  },
                });
              return;
            }
            this.registrationForm.controls.email.setErrors({
              checkEmail: 'There is already such email',
            });
          },
          error: (err) => {
            this.errorServices.handle(err);
          },
        });
    }
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
