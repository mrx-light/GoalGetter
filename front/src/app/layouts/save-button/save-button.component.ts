import {
  Component,
  inject,
  input,
  InputSignal,
  ViewChild,
} from '@angular/core';
import { SavesInterface } from '../../models/interface';
import { SavedPostsService } from '../../services/saved-posts.service';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { ErrorToastsComponent } from '../error-toasts/error-toasts.component';
import { WarningToastsComponent } from '../warning-toasts/warning-toasts.component';

@Component({
  selector: 'app-save-button',
  standalone: true,
  imports: [ErrorToastsComponent, WarningToastsComponent],
  templateUrl: './save-button.component.html',
  styleUrl: './save-button.component.css',
})
export class SaveButtonComponent {
  savedServices = inject(SavedPostsService);
  errorServices = inject(ErrorHandlerService);
  userName: InputSignal<string | undefined> = input();
  category: InputSignal<string | undefined> = input();
  idCategory: InputSignal<string | undefined> = input();
  seasonCategory: InputSignal<string | undefined> = input();

  @ViewChild('error') errorToast!: ErrorToastsComponent;
  @ViewChild('warning') warningToast!: WarningToastsComponent;

  addToSaves(user?: string, category?: string, id?: string, season?: string) {
    let found = undefined;
    if (category && id && user) {
      this.savedServices
        .getUsersSavedById(user)
        .pipe()
        .subscribe({
          next: (el) => {
            let obj: SavesInterface = el;
            switch (category) {
              case 'leagues': {
                found = obj.leagues.find((el) => {
                  return el == id;
                });
                if (found) {
                  this.errorServices.warningHandler(
                    'You already liked this league',
                    this.warningToast,
                  );
                  break;
                }
                obj.leagues.push(id);
                break;
              }
              case 'teams': {
                found = obj.teams.find((el) => {
                  return el == id;
                });
                if (found) {
                  this.errorServices.warningHandler(
                    'You already liked this team',
                    this.warningToast,
                  );
                  break;
                }
                obj.teams.push(id);
                break;
              }
              case 'players': {
                if (season) {
                  found = obj.players.find((el) => {
                    return el.id == id;
                  });
                  if (found) {
                    this.errorServices.warningHandler(
                      'You already liked this player',
                      this.warningToast,
                    );
                    break;
                  }
                  obj.players.push({ season, id });
                }
                break;
              }
              case 'venues': {
                found = obj.venues.find((el) => {
                  return el == id;
                });
                if (found) {
                  this.errorServices.warningHandler(
                    'You already liked this venue',
                    this.warningToast,
                  );
                  break;
                }
                obj.venues.push(id);
                break;
              }
              case 'coaches': {
                found = obj.coaches.find((el) => {
                  return el == id;
                });
                if (found) {
                  this.errorServices.warningHandler(
                    'You already liked this team',
                    this.warningToast,
                  );
                  break;
                }
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
