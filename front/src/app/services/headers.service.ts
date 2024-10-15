import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class HeadersService {
  setHeaders() {
    const options = {
      'x-rapidapi-host': 'v3.football.api-sports.io',
      'x-rapidapi-key': 'e83e8d58cc94681c2498016e00faef4f',
    };
    return { headers: new HttpHeaders(options) };
  }
  constructor() {}
}
