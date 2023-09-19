import { Component } from '@angular/core';
import { ClickAnimation } from 'src/app/services/animations';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  animations: [ClickAnimation],
})
export class SignInComponent {
  value: { email: string; userPassword: string } = {
    email: '',
    userPassword: '',
  };
  constructor(public authService: UserService) {
    {
    }
  }
}
