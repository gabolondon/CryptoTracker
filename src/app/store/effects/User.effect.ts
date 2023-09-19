import { UserService } from 'src/app/services/user.service';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, concat, from, lastValueFrom, of } from 'rxjs';
import {
  map,
  exhaustMap,
  catchError,
  mergeMap,
  withLatestFrom,
  mergeAll,
  switchMap,
  filter,
  concatMap,
  tap,
  delay,
} from 'rxjs/operators';
import { CurrencyApiService } from 'src/app/services/currency-api.service';
import { Store, props } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { CurrencyState } from 'src/app/models/Currency.state';
import {
  addFavorite,
  addFavoriteData,
  initPriceLive,
  updateFavorites,
  updateHistoricalDataOnFavorite,
  updatePriceOnFav,
} from '../actions/favorites.action';
import { Constants } from 'src/assets/Constants';
import { WebsocketService } from 'src/app/services/websocket.service';
import { updateTradesData } from '../actions/trades.action';
import {
  addFavoriteToUser,
  LoginUser,
  updateFavoritesFromFS,
} from '../actions/user.action';
import { selectUserfavorites } from '../selectors/user.selector';
import {
  addFavoriteOnCurrency,
  updateFavoritesFromFSOnCurrency,
} from '../actions/currencies.action';
import { UserState } from 'src/app/models/UserState.interface';

@Injectable()
export class UserEffects {
  updateUserData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(LoginUser),
      mergeMap((action) => {
        return this.userService.GetUserData(action.user.uid).pipe(
          concatMap((userFS) => {
            const updatedUser: UserState = {
              ...action.user,
              favoritesIds: userFS.data().favoritesIds,
            };

            return concat(
              of({
                type: updateFavoritesFromFS.type,
                user: updatedUser,
              }),
              of(
                updateFavorites({
                  favorites: updatedUser.favoritesIds,
                })
              ),
              of(
                updateFavoritesFromFSOnCurrency({
                  favorites: updatedUser.favoritesIds.map((id) => id.symbol_id),
                })
              )
            );
          }),
          catchError(() => {
            console.log('error effect updateUserData');
            return EMPTY;
          })
        );
      })
    );
  });

  // addFavowriteToFS$ = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(addFavorite),
  //     concatMap((action) => {
  //       return [
  //         addFavorite(action),
  //         addFavoriteToUser({ favId: action.favorite.symbol_id }),
  //       ];
  //     })
  //   );
  // });

  constructor(
    private actions$: Actions,
    private userService: UserService,
    private store: Store<AppState>
  ) {}
}
