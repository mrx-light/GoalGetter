import {
  Component,
  inject,
  input,
  InputSignal,
  OnDestroy,
  OnInit,
  ViewChildren,
} from '@angular/core';
import { HeaderComponent } from '../../layouts/header/header.component';
import { MenuComponent } from '../../layouts/menu/menu.component';
import { LeaguesService } from '../../services/leagues.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { LeaguesInterface } from '../../models/interface';
import { LeaguesModalComponent } from '../../layouts/leagues-modal/leagues-modal.component';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'app-leagues',
  standalone: true,
  imports: [
    HeaderComponent,
    MenuComponent,
    NgxPaginationModule,
    LeaguesModalComponent,
  ],
  templateUrl: './leagues.component.html',
  styleUrl: './leagues.component.css',
})
export class LeaguesComponent implements OnInit, OnDestroy {
  leaguesServices = inject<any>(LeaguesService);
  errorServices = inject(ErrorHandlerService);
  leaguesArray: LeaguesInterface[] = [];
  league: LeaguesInterface | undefined = undefined;
  ngUnsubscribe = new Subject<void>();

  @ViewChildren(LeaguesModalComponent) modal!: LeaguesModalComponent;
  leagues: InputSignal<LeaguesInterface | undefined> = input();

  p: any;

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

  ngOnInit(): void {
    this.leaguesServices
      .getLeagues()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res: any) => {
          this.leaguesArray = res.response;
        },
        error: (err: any) => {
          console.error('Something went wrong:', err);
          this.errorServices.errorHandleProfile(err);
        },
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
