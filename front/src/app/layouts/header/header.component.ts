import { Component, inject, input, InputSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  loginServices = inject(UserService);

  userId = input<string | undefined>(undefined);
  loginRegistration: InputSignal<boolean> = input(true);
  logOut() {
    this.loginServices.setLoggedUser(null);
  }
}
