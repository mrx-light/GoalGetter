import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseInterface } from '../models/interface';
import { HttpClient } from '@angular/common/http';
import { ROOT } from '../../../environment';
import { HeadersService } from './headers.service';

@Injectable({
  providedIn: 'root',
})
export class CoachesService {
  private http = inject(HttpClient);
  headersServices = inject(HeadersService);
  getCouches(team: string | number): Observable<ResponseInterface> {
    return this.http.get<ResponseInterface>(
      `${ROOT}coachs?team=${team}`,
      this.headersServices.setHeaders(),
    );
  }
  getCoachById(id: string) {
    return this.http.get<ResponseInterface>(
      `${ROOT}coachs?id=${id}`,
      this.headersServices.setHeaders(),
    );
  }
  constructor() {}
}
