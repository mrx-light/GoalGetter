import { inject, Injectable } from '@angular/core';
import { SavesInterface } from '../models/interface';
import { HttpClient } from '@angular/common/http';
import { SAVED_ROOT } from '../../../environment';

@Injectable({
  providedIn: 'root',
})
export class SavedPostsService {
  http = inject(HttpClient);

  getUsersSavedById(id: string) {
    return this.http.get<SavesInterface>(`${SAVED_ROOT}${id}`);
  }

  updateUserSaved(id: string, obj: any) {
    return this.http.put(`${SAVED_ROOT}${id}`, obj);
  }

  addUserToSaves(obj: SavesInterface) {
    return this.http.post(SAVED_ROOT, obj);
  }
  constructor() {}
}
