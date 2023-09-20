import { UserService } from 'src/app/services/user.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { map, Subject, take, takeUntil } from 'rxjs';

import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { UserModel } from 'src/app/models/UserModel.interface';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
  animations: [
    trigger('slideInLeft', [
      state(
        'void',
        style({
          transform: 'translateX(-100%)',
        })
      ),
      transition('void <=> *', animate('300ms')),
    ]),
  ],
})
export class SideNavComponent {
  private destroy$ = new Subject<void>();
  selected: string = '/dashboard/home';
  userData: UserModel;
  constructor(
    private router: Router,
    private userService: UserService,
    private store: Store<AppState>
  ) {
    this.store
      .select('user')
      .pipe(take(1))
      .subscribe((data) => {
        this.userData = data;
      });
    this.router.events
      .pipe(
        map((event) => this.router.url),
        takeUntil(this.destroy$)
      )
      .subscribe((url) => {
        this.selected = url;
      });
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  onHomeNav($event) {
    this.selected = '/dashboard/home';
    this.router.navigate(['dashboard/home']);
  }
  onFavNav($event) {
    this.selected = '/dashboard/favorites';
    this.router.navigate(['dashboard/favorites']);
  }
  onLogOut($event) {
    this.userService.SignOut();
    this.router.navigate(['sign-in']);
  }
}
