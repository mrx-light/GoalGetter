import {
  Component,
  inject,
  input,
  OnDestroy,
  OnInit,
  ViewChildren,
} from '@angular/core';
import { HeaderComponent } from '../../layouts/header/header.component';
import { MenuComponent } from '../../layouts/menu/menu.component';
import { LeaguesService } from '../../services/leagues.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { LeaguesInterface, UserInterface } from '../../models/interface';
import { LeaguesModalComponent } from '../../layouts/leagues-modal/leagues-modal.component';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { SaveButtonComponent } from '../../layouts/save-button/save-button.component';
@Component({
  selector: 'app-leagues',
  standalone: true,
  imports: [
    HeaderComponent,
    MenuComponent,
    NgxPaginationModule,
    LeaguesModalComponent,
    SaveButtonComponent,
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
  league: LeaguesInterface | undefined = undefined;
  destroyRef = new Subject<void>();
  userData: UserInterface | null = null;

  @ViewChildren(LeaguesModalComponent) modal!: LeaguesModalComponent;
  leagues = input<LeaguesInterface | null>(null);
  page: any;

  ngOnInit(): void {
    this.loginServices.getLoggedUser
      .pipe(takeUntil(this.destroyRef))
      .subscribe({
        next: (el: UserInterface | null) => {
          if (el) {
            this.userData = el;
            this.leaguesServices
              .getLeagues()
              .pipe(takeUntil(this.destroyRef))
              .subscribe({
                next: (res: any) => {
                  this.leaguesArray = res.response;
                },
                error: (err: any) => {
                  console.error('Something went wrong:', err);
                  this.errorServices.errorHandleProfile(err);
                },
              });
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
