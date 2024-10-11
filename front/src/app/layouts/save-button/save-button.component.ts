import { Component, inject, input, InputSignal } from '@angular/core';
import { SavesInterface } from '../../models/interface';
import { SavedPostsService } from '../../services/saved-posts.service';

@Component({
  selector: 'app-save-button',
  standalone: true,
  imports: [],
  templateUrl: './save-button.component.html',
  styleUrl: './save-button.component.css',
})
export class SaveButtonComponent {
  savedServices = inject(SavedPostsService);

  userName: InputSignal<string | undefined> = input();
  category: InputSignal<string | undefined> = input();
  idCategory: InputSignal<string | undefined> = input();
  seasonCategory: InputSignal<string | undefined> = input();

  addToSaves(user?: string, category?: string, id?: string, season?: string) {
    if (category && id && user) {
      this.savedServices
        .getUsersSavedById(user)
        .pipe()
        .subscribe({
          next: (el) => {
            let obj: SavesInterface = el;
            switch (category) {
              case 'leagues': {
                obj.leagues.push(id);
                break;
              }
              case 'teams': {
                obj.teams.push(id);

                break;
              }
              case 'players': {
                if (season) {
                  obj.players.push({ season, id });
                }
                break;
              }
              case 'venues': {
                obj.venues.push(id);

                break;
              }
              case 'coaches': {
                obj.coaches.push(id);

                break;
              }
            }
            this.savedServices.updateUserSaved(obj.id, obj).pipe().subscribe();
          },
        });
    }
  }
}
