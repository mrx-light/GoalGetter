import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ROOT } from '../../../environment';
import { HeadersService } from './headers.service';
import { ResponseInterface } from '../models/interface';
@Injectable({
  providedIn: 'root',
})
export class VenuesService {
  http = inject(HttpClient);
  headersServices = inject(HeadersService);
  getVenues(country: string) {
    return this.http.get<ResponseInterface>(
      `${ROOT}venues?country=${country}`,
      this.headersServices.setHeaders(),
    );
  }

  getVenueById(id: string) {
    return this.http.get<ResponseInterface>(
      `${ROOT}venues?id=${id}`,
      this.headersServices.setHeaders(),
    );
  }
  constructor() {}
}
