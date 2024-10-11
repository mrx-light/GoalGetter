import { Component, input, InputSignal } from '@angular/core';
import { LeaguesInterface } from '../../models/interface';

@Component({
  selector: 'app-leagues-card',
  standalone: true,
  imports: [],
  templateUrl: './leagues-card.component.html',
  styleUrl: './leagues-card.component.css',
})
export class LeaguesCardComponent {
  league: InputSignal<LeaguesInterface | undefined> = input<LeaguesInterface>();
}
