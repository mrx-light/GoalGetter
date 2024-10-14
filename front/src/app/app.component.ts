import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegistrationComponent } from './pages/registration/registration.component';
import { HeaderComponent } from './layouts/header/header.component';
import { ErrorToastsComponent } from './layouts/error-toasts/error-toasts.component';
import { WarningToastsComponent } from './layouts/warning-toasts/warning-toasts.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    LoginComponent,
    RegistrationComponent,
    HeaderComponent,
    ErrorToastsComponent,
    WarningToastsComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {}
