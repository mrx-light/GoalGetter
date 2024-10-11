import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserInterface } from '../models/interface';
import { BehaviorSubject } from 'rxjs';
import { USER_ROOT } from '../../../environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  loginRoot = 'http://localhost:3000/users';
  private http = inject(HttpClient);
  private userLogged = new BehaviorSubject<UserInterface | null>(null);
  getLoggedUser = this.userLogged.asObservable();

  setLoggedUser(obj: UserInterface | null) {
    this.userLogged.next(obj);
  }
  getUserByEmail(user: string) {
    return this.http.get<UserInterface>(USER_ROOT + `?email=${user}`);
  }
  updateUser(obj: UserInterface, id: string) {
    return this.http.put(this.loginRoot + `/${id}`, obj);
  }

  registryUser(user: UserInterface) {
    return this.http.post(USER_ROOT, user);
  }

  getUsers() {
    return this.http.get<UserInterface[]>(USER_ROOT);
  }

  updateUserData(id: string, obj: UserInterface) {
    return this.http.put<UserInterface>(`${USER_ROOT}${id}`, obj);
  }

  getUserByUsername(user: string) {
    return this.http.get<UserInterface>(USER_ROOT + `${user}`);
  }

  constructor() {}
}
