import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { HeaderNavComponent } from './components/header-nav/header-nav.component';
import { HomeComponent } from './pages/home/home.component';
import { FavoritesComponent } from './pages/favorites/favorites.component';
import { AllListComponent } from './components/all-list/all-list.component';
import { HttpClientModule } from '@angular/common/http';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { StoreModule } from '@ngrx/store';
import { ROOT_REDUCERS } from './store/app.state';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/enviroments/enviroment';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { EffectsModule } from '@ngrx/effects';
import { CurrenciesEffects } from './store/effects/Currencies.effect';
import { FavoritesListComponent } from './components/favorites-list/favorites-list.component';
import { FavoriteCardComponent } from './components/favorite-card/favorite-card.component';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { FavoritesEffects } from './store/effects/Favorites.effect';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgChartsModule } from 'ng2-charts';
import { TradesListComponent } from './components/trades-list/trades-list.component';
import { MatListModule } from '@angular/material/list';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UserEffects } from './store/effects/User.effect';

@NgModule({
  declarations: [
    AppComponent,
    HeaderNavComponent,
    HomeComponent,
    FavoritesComponent,
    AllListComponent,
    SignInComponent,
    SignUpComponent,
    FavoritesListComponent,
    FavoriteCardComponent,
    SideNavComponent,
    TradesListComponent,
    DashboardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    StoreModule.forRoot(ROOT_REDUCERS),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      name: 'Testing',
    }),
    EffectsModule.forRoot([CurrenciesEffects, FavoritesEffects, UserEffects]),
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatTableModule,
    MatToolbarModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    HttpClientModule,
    MatPaginatorModule,
    MatSortModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    MatSnackBarModule,
    NgChartsModule,
    ScrollingModule,
    MatListModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
