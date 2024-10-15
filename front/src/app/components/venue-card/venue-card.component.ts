import { Component, input, InputSignal } from '@angular/core';
import { VenuesInterface } from '../../models/interface';

@Component({
  selector: 'app-venue-card',
  standalone: true,
  imports: [],
  templateUrl: './venue-card.component.html',
  styleUrl: './venue-card.component.css',
})
export class VenueCardComponent {
  venue: InputSignal<VenuesInterface | undefined> = input<VenuesInterface>();
}
