import { Component, inject, OnDestroy } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../../services/user.service';
import { UserInterface } from '../../models/interface';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { HeaderComponent } from '../../layouts/header/header.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, HeaderComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnDestroy {
  errorServices = inject(ErrorHandlerService);
  loginServices = inject(UserService);
  route = inject(Router);
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

  destroyRef = new Subject<void>();

  ngOnDestroy() {
    this.destroyRef.next();
    this.destroyRef.complete();
  }

  logIN() {
    this.loginServices.getLoggedUser
      .pipe(takeUntil(this.destroyRef))
      .subscribe({
        next: (el: UserInterface | null) => {
          if (!el) {
            if (!(this.loginForm.controls.emailUser.value.length == 0)) {
              this.loginServices
                .getUserByEmail(this.loginForm.controls.emailUser.value)
                .pipe(takeUntil(this.destroyRef))
                .subscribe({
                  next: (res: any) => {
                    if (res.length) {
                      let obj: UserInterface = res[0];
                      if (
                        this.loginForm.controls.password.value === obj.password
                      ) {
                        obj.isActive = true;
                        this.loginServices
                          .updateUser(obj, obj.id)
                          .pipe(takeUntil(this.destroyRef))
                          .subscribe({
                            next: (res: any) => {
                              if (res.id) {
                                this.loginServices.setLoggedUser(res);
                                this.route.navigateByUrl('/main');
                                return;
                              }
                              alert('We could not log you in');
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
            return;
          }
        },
      });
  }
}
