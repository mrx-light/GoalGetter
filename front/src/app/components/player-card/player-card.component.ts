import { Component, input, InputSignal } from '@angular/core';
import { PlayerInterface } from '../../models/interface';

@Component({
  selector: 'app-player-card',
  standalone: true,
  imports: [],
  templateUrl: './player-card.component.html',
  styleUrl: './player-card.component.css',
})
export class PlayerCardComponent {
  player: InputSignal<PlayerInterface | undefined> = input<PlayerInterface>();
}
