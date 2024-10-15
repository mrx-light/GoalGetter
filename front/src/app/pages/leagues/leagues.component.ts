import {
  Component,
  inject,
  input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { HeaderComponent } from '../../layouts/header/header.component';
import { MenuComponent } from '../../layouts/menu/menu.component';
import { LeaguesService } from '../../services/leagues.service';
import { NgxPaginationModule } from 'ngx-pagination';
import {
  LeaguesInterface,
  ResponseInterface,
  UserInterface,
} from '../../models/interface';
import { LeaguesModalComponent } from '../../layouts/leagues-modal/leagues-modal.component';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { SaveButtonComponent } from '../../layouts/save-button/save-button.component';
import { ErrorToastsComponent } from '../../layouts/error-toasts/error-toasts.component';
import { WarningToastsComponent } from '../../layouts/warning-toasts/warning-toasts.component';
@Component({
  selector: 'app-leagues',
  standalone: true,
  imports: [
    HeaderComponent,
    MenuComponent,
    NgxPaginationModule,
    LeaguesModalComponent,
    SaveButtonComponent,
    ErrorToastsComponent,
    WarningToastsComponent,
  ],
  templateUrl: './leagues.component.html',
  styleUrl: './leagues.component.css',
})
export class LeaguesComponent implements OnInit, OnDestroy {
  leaguesServices = inject<any>(LeaguesService);
  loginServices = inject(UserService);
  errorServices = inject(ErrorHandlerService);
  navigate = inject(Router);

  leaguesArray: LeaguesInterface[] = [];
  errorMessageLeagues = '';
  league: LeaguesInterface | undefined = undefined;
  destroyRef = new Subject<void>();
  userData: UserInterface | null = null;

  @ViewChildren(LeaguesModalComponent) modal!: LeaguesModalComponent;
  @ViewChild('error') errorToast!: ErrorToastsComponent;
  @ViewChild('warning') warningToast!: WarningToastsComponent;

  leagues = input<LeaguesInterface | null>(null);
  page: any;

  ngOnInit(): void {
    this.loginServices.getLoggedUser
      .pipe(takeUntil(this.destroyRef))
      .subscribe({
        next: (el: UserInterface | null) => {
          if (el) {
            this.userData = el;
            this.getLeagues();
            return;
          }
          this.navigate.navigateByUrl('/login');
        },
      });
  }

  ngOnDestroy(): void {
    this.destroyRef.next();
    this.destroyRef.complete();
  }

  getLeagues() {
    this.leaguesServices
      .getLeagues()
      .pipe(takeUntil(this.destroyRef))
      .subscribe({
        next: (res: ResponseInterface) => {
          if (res.errors.length) {
            this.errorServices.warningHandler(
              'Something went wrong, try again later',
              this.warningToast,
            );
            return;
          }
          this.leaguesArray = res.response;
          if (this.leaguesArray.length == 0)
            this.errorMessageLeagues = 'Something went wrong';
        },
        error: (err: any) => {
          this.errorServices.errorHandlerUser(err, this.errorToast);
        },
      });
    return;
  }

  sortByName(arr: LeaguesInterface[], key: any) {
    if (arr.length > 0) {
      this.leaguesArray = this.leaguesServices.sortLeagues(arr, key);
    }
  }

  passDataToModal(obj: LeaguesInterface) {
    if (this.modal) {
      this.league = obj;
    }
  }
}
