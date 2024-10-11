import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PlayerInterface, ResponseInterface } from '../models/interface';
import { HeadersService } from './headers.service';
import { ROOT } from '../../../environment';

@Injectable({
  providedIn: 'root',
})
export class PlayersService {
  headersServices = inject(HeadersService);
  http = inject(HttpClient);

  getCountry() {
    return this.http.get<ResponseInterface>(
      `${ROOT}countries`,
      this.headersServices.setHeaders(),
    );
  }
  getSeasons() {
    return this.http.get<ResponseInterface>(
      `${ROOT}players/seasons`,
      this.headersServices.setHeaders(),
    );
  }

  getPlayers(team: string | number, year: string) {
    return this.http.get<ResponseInterface>(
      `${ROOT}players?team=${team}&season=${year}`,
      this.headersServices.setHeaders(),
    );
  }

  getPlayerById(id: string, season: string) {
    return this.http.get<ResponseInterface>(
      `${ROOT}players?id=${id}&season=${season}`,
      this.headersServices.setHeaders(),
    );
  }

  sortPlayersBy(
    array: PlayerInterface[],
    key:
      | 'id'
      | 'name'
      | 'weight'
      | 'height'
      | 'age'
      | 'yellow-card'
      | 'red-card'
      | 'duels'
      | 'goals',
  ) {
    let aValue: any, bValue: any;

    return array.sort((a: PlayerInterface, b: PlayerInterface) => {
      switch (key) {
        case 'id': {
          aValue = a.player.id;
          bValue = b.player.id;
          break;
        }
        case 'name': {
          aValue = a.player.name;
          bValue = b.player.name;
          break;
        }
        case 'weight': {
          aValue = a.player.weight;
          bValue = b.player.weight;
          break;
        }
        case 'age': {
          aValue = a.player.age;
          bValue = b.player.age;
          break;
        }
        case 'height': {
          aValue = a.player.height;
          bValue = b.player.height;
          break;
        }
        case 'goals': {
          aValue = a.statistics[0]?.goals.total;
          bValue = b.statistics[0]?.goals.total;
          break;
        }
        case 'duels': {
          aValue = a.statistics[0]?.duels.total;
          bValue = b.statistics[0]?.duels.total;
          break;
        }
        case 'yellow-card': {
          aValue = a.statistics[0]?.cards.yellow;
          bValue = b.statistics[0]?.cards.yellow;
          break;
        }
        case 'red-card': {
          aValue = a.statistics[0]?.cards.red;
          bValue = b.statistics[0]?.cards.red;
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
