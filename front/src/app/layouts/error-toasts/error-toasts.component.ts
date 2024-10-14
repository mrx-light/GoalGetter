import { Component, input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-error-toasts',
  standalone: true,
  imports: [NgClass],
  templateUrl: './error-toasts.component.html',
  styleUrl: './error-toasts.component.css',
})
export class ErrorToastsComponent {
  errorMessage = input<string>('');
  show = false;
  message: string = '';
  showToast() {
    this.show = true;
  }
  hideToast() {
    this.show = false;
  }
}
