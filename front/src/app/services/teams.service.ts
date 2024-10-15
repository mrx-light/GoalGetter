import { inject, Injectable } from '@angular/core';
import { ResponseInterface, TeamsInterface } from '../models/interface';
import { HttpClient } from '@angular/common/http';
import { HeadersService } from './headers.service';
import { ROOT } from '../../../environment';

@Injectable({
  providedIn: 'root',
})
export class TeamsService {
  private http = inject(HttpClient);
  headersServices = inject(HeadersService);
  getTeamById(id: string) {
    return this.http.get<ResponseInterface>(
      `${ROOT}teams?id=${id}`,
      this.headersServices.setHeaders(),
    );
  }

  getTeams(country: string) {
    return this.http.get<ResponseInterface>(
      `${ROOT}teams?country=${country}`,
      this.headersServices.setHeaders(),
    );
  }

  sortTeamsBy(
    array: TeamsInterface[],
    key:
      | 'id'
      | 'name'
      | 'founded'
      | 'country'
      | 'code'
      | 'venue-capacity'
      | 'venue-name'
      | 'venue-city'
      | 'surface',
  ) {
    let aValue: any, bValue: any;
    return array.sort((a: TeamsInterface, b: TeamsInterface) => {
      switch (key) {
        case 'id': {
          aValue = a.team.id;
          bValue = b.team.id;
          break;
        }
        case 'name': {
          aValue = a.team.name;
          bValue = b.team.name;
          break;
        }
        case 'founded': {
          aValue = a.team.founded;
          bValue = b.team.founded;
          break;
        }
        case 'country': {
          aValue = a.team.country;
          bValue = b.team.country;
          break;
        }
        case 'code': {
          aValue = a.team.code;
          bValue = b.team.code;
          break;
        }
        case 'venue-capacity': {
          aValue = a.venue.capacity;
          bValue = b.venue.capacity;
          break;
        }
        case 'surface': {
          aValue = a.venue.surface;
          bValue = b.venue.surface;
          break;
        }
        case 'venue-name': {
          aValue = a.venue.name;
          bValue = b.venue.name;
          break;
        }
        case 'venue-city': {
          aValue = a.venue.city;
          bValue = b.venue.city;
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
