import { UserService } from 'src/app/services/user.service';
import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Observable, filter, map } from 'rxjs';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

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
  selected: string = '/dashboard/home';
  constructor(private router: Router, private userService: UserService) {
    this.router.events
      .pipe(
        // filter((event) => event instanceof NavigationEnd),
        map((event) => this.router.url)
      )
      .subscribe((url) => {
        console.log(url);
        this.selected = url;
      });
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
