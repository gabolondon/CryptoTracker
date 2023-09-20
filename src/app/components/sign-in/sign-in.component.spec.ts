import {
  ComponentFixture,
  TestBed,
  tick,
  fakeAsync,
} from '@angular/core/testing';
import { SignInComponent } from './sign-in.component';
import { UserService } from 'src/app/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/enviroments/enviroment';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { provideMockStore } from '@ngrx/store/testing';
import { StoreModule } from '@ngrx/store';

describe('SignInComponent', () => {
  let component: SignInComponent;
  let fixture: ComponentFixture<SignInComponent>;
  let authService: UserService;
  let snackBar: MatSnackBar;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SignInComponent],
      providers: [MatSnackBar, provideMockStore({})],
      imports: [
        StoreModule.forRoot({}),
        BrowserAnimationsModule,
        AngularFireAuth,
        AngularFireModule.initializeApp(environment.firebaseConfig),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(SignInComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(UserService);
    snackBar = TestBed.inject(MatSnackBar);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should open a snackbar when email or password is empty on login', fakeAsync(() => {
    spyOn(snackBar, 'open');
    spyOn(authService, 'SignIn');
    component.onLogin('', ''); // Trigger the onLogin method with empty email and password
    tick(2000);

    expect(snackBar.open).toHaveBeenCalledWith(
      'Please fill in all fields',
      'Close',
      {
        duration: 2000,
      }
    );
    expect(authService.SignIn).not.toHaveBeenCalled(); // Ensure SignIn is not called
  }));

  it('should call authService.SignIn when both email and password are provided', () => {
    spyOn(authService, 'SignIn');
    component.onLogin('test@example.com', 'password123');

    expect(authService.SignIn).toHaveBeenCalledWith(
      'test@example.com',
      'password123'
    );
  });
  it('should open a snackbar when only email is provided', fakeAsync(() => {
    spyOn(authService, 'SignIn');
    spyOn(snackBar, 'open');
    component.onLogin('test@example.com', '');

    tick(2000);

    expect(snackBar.open).toHaveBeenCalledWith(
      'Please fill in all fields',
      'Close',
      {
        duration: 2000,
      }
    );
    expect(authService.SignIn).not.toHaveBeenCalled(); // Ensure SignIn is not called
  }));

  it('should open a snackbar when only password is provided', fakeAsync(() => {
    spyOn(authService, 'SignIn');
    spyOn(snackBar, 'open');
    component.onLogin('', 'password123');

    tick(2000);

    expect(snackBar.open).toHaveBeenCalledWith(
      'Please fill in all fields',
      'Close',
      {
        duration: 2000,
      }
    );
    expect(authService.SignIn).not.toHaveBeenCalled(); // Ensure SignIn is not called
  }));
});
