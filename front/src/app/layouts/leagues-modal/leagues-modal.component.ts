import { Component, input, InputSignal } from '@angular/core';
import { LeaguesInterface } from '../../models/interface';
import { SaveButtonComponent } from '../save-button/save-button.component';

@Component({
  selector: 'app-leagues-modal',
  standalone: true,
  imports: [SaveButtonComponent],
  templateUrl: './leagues-modal.component.html',
  styleUrl: './leagues-modal.component.css',
})
export class LeaguesModalComponent {
  leagueInfo: InputSignal<LeaguesInterface | undefined> = input();
  userId: InputSignal<string | undefined> = input();
}
