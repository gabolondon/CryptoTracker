import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.state';
import { UserModel } from '../models/UserModel.interface';
import { UserState } from '../models/UserState.interface';
import { of } from 'rxjs';
import { User } from 'firebase/auth';

describe('UserService', () => {
  let service: UserService;
  let afAuth: jasmine.SpyObj<AngularFireAuth>;
  let aFirestore: jasmine.SpyObj<AngularFirestore>;
  let router: jasmine.SpyObj<Router>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;
  let store: jasmine.SpyObj<Store<AppState>>;

  beforeEach(() => {
    const afAuthSpy = jasmine.createSpyObj('AngularFireAuth', [
      'signInWithEmailAndPassword',
      'createUserWithEmailAndPassword',
      'signOut',
    ]);
    const aFirestoreSpy = jasmine.createSpyObj('AngularFirestore', ['doc']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    const storeSpy = jasmine.createSpyObj('Store', ['dispatch']);

    TestBed.configureTestingModule({
      providers: [
        UserService,
        { provide: AngularFireAuth, useValue: afAuthSpy },
        { provide: AngularFirestore, useValue: aFirestoreSpy },
        { provide: Router, useValue: routerSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: Store, useValue: storeSpy },
      ],
    });

    service = TestBed.inject(UserService);
    afAuth = TestBed.inject(AngularFireAuth) as jasmine.SpyObj<AngularFireAuth>;
    aFirestore = TestBed.inject(
      AngularFirestore
    ) as jasmine.SpyObj<AngularFirestore>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
    store = TestBed.inject(Store) as jasmine.SpyObj<Store<AppState>>;
  });

  // Pruebas para SignIn con parámetros de tipos diferentes
  it('should handle SignIn with different parameter types', () => {
    const email = 123; // Tipo incorrecto
    const password = ['invalid']; // Tipo incorrecto

    // Supongamos que afAuth.signInWithEmailAndPassword no se llama en este escenario
    service.SignIn(email as any, password as any);

    expect(afAuth.signInWithEmailAndPassword).not.toHaveBeenCalled();
    // Añade más expectativas según tu lógica de manejo de tipos incorrectos
  });

  // Puedes seguir el mismo patrón para pruebas de SignUp, GetUserData y otras funciones

  afterEach(() => {
    // Realizar tareas de limpieza después de cada prueba si es necesario
  });
});
