import { Injectable } from '@angular/core';
import { UserErrorInterface } from '../models/interface';
import { ErrorToastsComponent } from '../layouts/error-toasts/error-toasts.component';
import { WarningToastsComponent } from '../layouts/warning-toasts/warning-toasts.component';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  constructor() {}

  handle(error: any) {
    console.error('An error occurred: ', error);
    alert(`Something went wrong: ${error}`);
  }

  errorHandleProfile(error: any) {
    console.error('An Error occurred: ', error.message);
    if (error.message) {
      alert(`Something went wrong: ${error.message}`);
    }
  }

  errorHandlerUser(error: UserErrorInterface, toast: ErrorToastsComponent) {
    if (!error.ok) {
      console.error(error.message);
      toast.showToast();
      toast.message = error.message;
    }
  }

  warningHandler(
    errorMessage: string,
    toast: WarningToastsComponent,
  ): Observable<string> {
    toast.showToast();
    toast.message = errorMessage;
    return of(errorMessage);
  }
}
