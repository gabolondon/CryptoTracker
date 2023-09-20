import {
  ComponentFixture,
  TestBed,
  tick,
  fakeAsync,
} from '@angular/core/testing';
import { SignUpComponent } from './sign-up.component';
import { UserService } from 'src/app/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/enviroments/enviroment';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { provideMockStore } from '@ngrx/store/testing';
import { UserModel } from 'src/app/models/UserModel.interface';
import { StoreModule } from '@ngrx/store';

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;
  let authService: UserService;
  let snackBar: MatSnackBar;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SignUpComponent],
      providers: [MatSnackBar, AngularFireAuth, provideMockStore({})],
      imports: [
        StoreModule.forRoot({}),
        BrowserAnimationsModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(UserService);
    snackBar = TestBed.inject(MatSnackBar);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
  it('should open a snackbar when email, password, or name is empty on sign up', fakeAsync(() => {
    spyOn(snackBar, 'open');
    spyOn(authService, 'SignUp');

    // Trigger the onSignUp method with empty email, password, and name
    component.onSignUp('', '', '');

    tick(2000);

    expect(snackBar.open).toHaveBeenCalledWith(
      'Please fill in all fields',
      'Close',
      {
        duration: 2000,
      }
    );
    expect(authService.SignUp).not.toHaveBeenCalled(); // Ensure SignUp is not called
  }));

  it('should open a snackbar when only email is provided on sign up', fakeAsync(() => {
    spyOn(authService, 'SignUp');
    spyOn(snackBar, 'open');

    // Trigger the onSignUp method with only email provided
    component.onSignUp('test@example.com', '', '');

    tick(2000);

    expect(snackBar.open).toHaveBeenCalledWith(
      'Please fill in all fields',
      'Close',
      {
        duration: 2000,
      }
    );
    expect(authService.SignUp).not.toHaveBeenCalled(); // Ensure SignUp is not called
  }));

  it('should open a snackbar when only password is provided on sign up', fakeAsync(() => {
    spyOn(authService, 'SignUp');
    spyOn(snackBar, 'open');

    // Trigger the onSignUp method with only password provided
    component.onSignUp('', 'password123', '');

    tick(2000);

    expect(snackBar.open).toHaveBeenCalledWith(
      'Please fill in all fields',
      'Close',
      {
        duration: 2000,
      }
    );
    expect(authService.SignUp).not.toHaveBeenCalled(); // Ensure SignUp is not called
  }));

  it('should open a snackbar when only name is provided on sign up', fakeAsync(() => {
    spyOn(authService, 'SignUp');
    spyOn(snackBar, 'open');

    // Trigger the onSignUp method with only name provided
    component.onSignUp('', '', 'name1');

    tick(2000);

    expect(snackBar.open).toHaveBeenCalledWith(
      'Please fill in all fields',
      'Close',
      {
        duration: 2000,
      }
    );
    expect(authService.SignUp).not.toHaveBeenCalled(); // Ensure SignUp is not called
  }));

  it('should call authService.SignUp when all email, password, and name are provided', () => {
    spyOn(authService, 'SignUp');

    // Trigger the onSignUp method with all fields provided
    component.onSignUp('test@example.com', 'password123', 'name1');

    expect(authService.SignUp).toHaveBeenCalledWith(
      'test@example.com',
      'password123',
      'name1'
    );
  });
});
