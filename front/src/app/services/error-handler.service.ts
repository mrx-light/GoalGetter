import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  handle(error: any) {
    console.error('An error occurred: ', error);
    alert(`Something went wrong: ${error}`);
  }

  errorHandleProfile(error: any) {
    console.error('An Error occurred: ', error);
    if (error.message) {
      alert(`Something went wrong: ${error.message}`);
    }
  }
  constructor() {}
}
