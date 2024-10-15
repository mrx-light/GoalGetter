import { Component, input, InputSignal } from '@angular/core';
import { TeamsInterface } from '../../models/interface';

@Component({
  selector: 'app-team-card',
  standalone: true,
  imports: [],
  templateUrl: './team-card.component.html',
  styleUrl: './team-card.component.css',
})
export class TeamCardComponent {
  teams: InputSignal<TeamsInterface | undefined> = input<TeamsInterface>();
}
