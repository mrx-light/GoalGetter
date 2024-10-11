import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LeaguesInterface, ResponseInterface } from '../models/interface';
import { HeadersService } from './headers.service';
import { ROOT } from '../../../environment';

@Injectable({
  providedIn: 'root',
})
export class LeaguesService {
  http = inject(HttpClient);
  rootLeagues: string = 'https://v3.football.api-sports.io/leagues';
  headersServices = inject(HeadersService);

  getLeagues() {
    return this.http.get<ResponseInterface>(
      `${ROOT}leagues`,
      this.headersServices.setHeaders(),
    );
  }
  getLeaguesById(id: string) {
    return this.http.get<ResponseInterface>(
      `${this.rootLeagues}?id=${id}`,
      this.headersServices.setHeaders(),
    );
  }

  sortLeagues(
    array: LeaguesInterface[],
    key:
      | 'name'
      | 'id'
      | 'start'
      | 'end'
      | 'current'
      | 'year'
      | 'country'
      | 'season',
  ) {
    return array.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (key) {
        case 'name': {
          aValue = a.league.name;
          bValue = b.league.name;
          break;
        }
        case 'country': {
          aValue = a.country.name;
          bValue = b.country.name;
          break;
        }
        case 'id': {
          aValue = a.league.id;
          bValue = b.league.id;
          break;
        }
        case 'start': {
          aValue = a.seasons[0]?.start;
          bValue = b.seasons[0]?.start;
          break;
        }
        case 'season': {
          aValue = a.seasons[0]?.year;
          bValue = b.seasons[0]?.year;
          break;
        }
        case 'end': {
          aValue = a.seasons[0]?.end;
          bValue = b.seasons[0]?.end;
          break;
        }
        case 'current': {
          aValue = !!a.seasons[0]?.current;
          bValue = !!b.seasons[0]?.current;
          if (aValue === bValue) return 0;
          return aValue ? -1 : 1;
        }
        case 'year': {
          aValue = a.seasons[0]?.year;
          bValue = b.seasons[0]?.year;
          break;
        }
      }

      if (aValue < bValue) {
        return -1;
      }
      if (aValue > bValue) {
        return 1;
      }
      return 0;
    });
  }

  constructor() {}
}
