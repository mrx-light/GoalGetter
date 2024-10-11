import { Component, input, InputSignal } from '@angular/core';
import { CoachesInterface } from '../../models/interface';

@Component({
  selector: 'app-coach-card',
  standalone: true,
  imports: [],
  templateUrl: './coach-card.component.html',
  styleUrl: './coach-card.component.css',
})
export class CoachCardComponent {
  coach: InputSignal<CoachesInterface | undefined> = input<CoachesInterface>();
}
