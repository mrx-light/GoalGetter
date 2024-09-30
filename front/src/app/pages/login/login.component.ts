import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { UserInterface } from '../../models/interface';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { PassDataService } from '../../services/pass-data.service';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit, OnDestroy {
  errorServices = inject(ErrorHandlerService);
  loginServices = inject(LoginService);
  passUser = inject(PassDataService);
  obj = this.passUser.getUser;
  route = inject(Router);
  ngUnsubscribe = new Subject<void>();
  form = inject(NonNullableFormBuilder);
  loginForm = this.form.group({
    emailUser: [
      '',
      [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(40),
        Validators.email,
      ],
    ],
    password: [
      '',
      [Validators.required, Validators.minLength(5), Validators.maxLength(40)],
    ],
  });

  logIN() {
    this.passUser.setUser({});
    if (!(this.loginForm.controls.emailUser.value.length == 0)) {
      this.loginServices
        .logIn(this.loginForm.controls.emailUser.value)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: (res: any) => {
            if (res.length) {
              let obj: UserInterface = res[0];
              if (this.loginForm.controls.password.value === obj.password) {
                obj.isActive = true;
                this.loginServices
                  .updateUser(obj, obj.id)
                  .pipe(takeUntil(this.ngUnsubscribe))
                  .subscribe({
                    next: (res: any) => {
                      this.passUser.setUser(res);
                      this.passUser.user
                        .pipe(takeUntil(this.ngUnsubscribe))
                        .subscribe((result: UserInterface) => {});
                      this.route.navigateByUrl('/profile');
                    },
                    error: (err) => {
                      this.errorServices.handle(err);
                    },
                  });
                return;
              }
              this.loginForm.controls.password.setErrors({
                wrongPassword: 'The password is Wrong',
              });
              return;
            }
            this.loginForm.controls.emailUser.setErrors({
              undefinedUser: 'There is no such email',
            });
          },
          error: (err) => {
            this.errorServices.handle(err);
          },
        });
    }
  }
  ngOnInit() {
    if (!this.obj.id) {
    }
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
