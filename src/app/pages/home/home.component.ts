import { Router } from '@angular/router';
import { Component } from '@angular/core';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  constructor(private router: Router) {}
  onClick(event: any) {
    this.router.navigate(['favorites']);
  }
}
