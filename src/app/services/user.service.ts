import { state } from '@angular/animations';
import { Injectable, NgZone, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import * as auth from 'firebase/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
  CollectionReference,
} from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.state';
import { LoginUser } from '../store/actions/user.action';
import { UserModel } from '../models/UserModel.interface';
import { UserState } from '../models/UserState.interface';
import { Observable, mergeMap, take, takeUntil } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  userData: any; // Save logged in user data
  public readonly userDoc$: Observable<any>;

  constructor(
    private aFirestore: AngularFirestore,
    public afAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone,
    private _snackBar: MatSnackBar,
    private store: Store<AppState>
  ) {
    // const ref = collection(firestore, `Users`);
    // this.userDoc$ = collectionData(ref);
    this.afAuth.authState.pipe().subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user')!);
      } else {
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }
    });
  }
  SetUserData(user: UserState) {
    const userRef: AngularFirestoreDocument<any> = this.aFirestore.doc(
      `Users/${user.uid}`
    );
    console.log('writing user data to fs', user);

    return userRef.set(user, {
      merge: true,
    });
  }
  GetUserData(userId: string) {
    const userRef: AngularFirestoreDocument<any> = this.aFirestore.doc(
      `Users/${userId}`
    );
    return userRef.get();
    // return userRef.valueChanges();
  }

  SignIn(email: string, password: string) {
    console.log('trying to login with: ', email, password);
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        console.log('Firebase SignIn success: ', result.user);
        // this.SetUserData(result.user);
        this.afAuth.authState.subscribe((user) => {
          if (user) {
            this.store.dispatch({
              type: LoginUser.type,
              user: user,
            });
            this.router.navigate(['dashboard']);
          }
        });
      })
      .catch((error) => {
        this._snackBar.open(error.message, 'OK', {
          duration: 5000,
        });
      });
  }
  SignUp(email: string, password: string, displayName: string) {
    console.log('trying to register with: ', email, password);
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        result.user
          .updateProfile({
            displayName: displayName,
          })
          .then(() => {
            console.log('Profile updated with name');
          })
          .catch((error) => {
            this._snackBar.open(error.message, 'OK', {
              duration: 5000,
            });
          });
        const parsedUser: UserModel = {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          emailVerified: result.user.emailVerified,
        };
        console.log('Firebase SignUp success: ', result.user);

        this.store.dispatch({
          type: LoginUser.type,
          user: parsedUser,
        });
        this.SetUserData({ ...parsedUser, favoritesIds: [] });
        this.afAuth.authState.subscribe((user) => {
          if (user) {
            this.router.navigate(['dashboard']);
          }
        });
      })
      .catch((error) => {
        this._snackBar.open(error.message, 'OK', {
          duration: 5000,
        });
      });
  }
  // SendVerificationMail() {
  //   return this.afAuth.currentUser
  //     .then((u: any) => u.sendEmailVerification())
  //     .then(() => {
  //       this.router.navigate(['verify-email-address']);
  //     });
  // }
  // Reset Forggot password

  // Returns true when user is looged in and email is verified
  isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    if (user !== null) {
      this.store.dispatch({
        type: LoginUser.type,
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || '',
          photoURL: user.photoUR || '',
          emailVerified: user.emailVerified,
        },
      });
    }
    return user !== null && user.emailVerified !== false ? true : false;
  }
  // GoogleAuth() {
  //   return this.AuthLogin(new auth.GoogleAuthProvider()).then((res: any) => {
  //     this.router.navigate(['dashboard']);
  //   });
  // }
  // // Auth logic to run auth providers
  // AuthLogin(provider: any) {
  //   return this.afAuth
  //     .signInWithPopup(provider)
  //     .then((result) => {
  //       this.router.navigate(['dashboard']);
  //       this.SetUserData(result.user);
  //     })
  //     .catch((error) => {

  //       window.alert(this.ParseError(error));
  //     });
  // }
  // Sign out
  SignOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['sign-in']);
    });
  }
  // make me a function that i pass my error and the function return a readable text of the code from firebase auth
  ParseError(error: any) {
    let err = error.message;
    if (err == 'auth/invalid-email') {
      return 'Invalid email, please correct and try again';
    } else if (err == 'auth/wrong-password') {
      return 'Wrong password, please correct and try again';
    } else if (err == 'auth/user-not-found') {
      return 'User not found, please register and try again';
    } else if (err == 'auth/too-many-requests') {
      return 'Too many requests, please try again later';
    } else if (err == 'auth/email-already-in-use') {
      return 'Email already in use';
    } else if (err == 'auth/user-cancelled') {
      return 'User subscription cancelled';
    } else if (err == 'auth/auth/user-not-found') {
      return 'User not found, please register and try again';
    } else if (err == 'auth/weak-password') {
      return 'Your password is too weak, make another stronger';
    } else if (err == 'auth/invalid-login-credentials') {
      return 'Invalid Login Credentials, rectify and try again';
    } else {
      return error;
    }
  }
}
