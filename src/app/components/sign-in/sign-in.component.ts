import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClickAnimation } from 'src/app/services/animations';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  animations: [ClickAnimation],
})
export class SignInComponent {
  constructor(
    public authService: UserService,
    private _snackBar: MatSnackBar
  ) {}

  onLogin(email: string, password: string) {
    if (email === '' || password === '') {
      this._snackBar.open('Please fill in all fields', 'Close', {
        duration: 2000,
      });
    } else {
      this.authService.SignIn(email, password);
    }
  }
}
