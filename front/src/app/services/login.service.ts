import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserInterface } from '../models/interface';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  loginRoot = 'http://localhost:3000/users';
  private http = inject(HttpClient);

  logIn(user: string) {
    return this.http.get(this.loginRoot + `?email=${user}`);
  }
  updateUser(obj: UserInterface, id: string) {
    return this.http.put(this.loginRoot + `/${id}`, obj);
  }
  constructor() {}
}
