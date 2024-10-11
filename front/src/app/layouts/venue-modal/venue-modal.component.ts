import { Component, input, InputSignal } from '@angular/core';
import { VenuesInterface } from '../../models/interface';
import { SaveButtonComponent } from '../save-button/save-button.component';

@Component({
  selector: 'app-venue-modal',
  standalone: true,
  imports: [SaveButtonComponent],
  templateUrl: './venue-modal.component.html',
  styleUrl: './venue-modal.component.css',
})
export class VenueModalComponent {
  venue: InputSignal<VenuesInterface | undefined> = input();
  userId: InputSignal<string | undefined> = input();
}
