import { NgChartsModule } from 'ng2-charts';
import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent {
  constructor(
    public authService: UserService,
    private _snackBar: MatSnackBar
  ) {}

  onSignUp(email: string, password: string, name: string) {
    if (email === '' || password === '' || name === '') {
      this._snackBar.open('Please fill in all fields', 'Close', {
        duration: 2000,
      });
    } else {
      this.authService.SignUp(email, password, name);
    }
  }
}
