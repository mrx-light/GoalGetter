import { Component } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-warning-toasts',
  standalone: true,
  imports: [NgClass],
  templateUrl: './warning-toasts.component.html',
  styleUrl: './warning-toasts.component.css',
})
export class WarningToastsComponent {
  show = false;
  message = '';
  showToast() {
    this.show = true;
  }

  hideToast() {
    this.show = false;
  }
}
