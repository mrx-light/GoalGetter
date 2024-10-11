import { Component, input, InputSignal } from '@angular/core';
import { TeamsInterface } from '../../models/interface';
import { SaveButtonComponent } from '../save-button/save-button.component';

@Component({
  selector: 'app-team-modal',
  standalone: true,
  imports: [SaveButtonComponent],
  templateUrl: './team-modal.component.html',
  styleUrl: './team-modal.component.css',
})
export class TeamModalComponent {
  teamInfo: InputSignal<TeamsInterface | undefined> = input();
  userId: InputSignal<string | undefined> = input();
}
