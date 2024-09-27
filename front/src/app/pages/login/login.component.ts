import { Component, inject, OnInit } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  form = inject(NonNullableFormBuilder);
  loginForm = this.form.group({
    emailUser: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  logIN() {
    console.log('Login:', this.loginForm.getRawValue());
  }
  ngOnInit() {}
}
