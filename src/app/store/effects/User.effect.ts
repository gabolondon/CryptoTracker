import { UserService } from 'src/app/services/user.service';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, concat, of } from 'rxjs';
import { catchError, mergeMap, concatMap } from 'rxjs/operators';
import { Store, props } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { updateFavorites } from '../actions/favorites.action';
import { LoginUser, updateFavoritesFromFS } from '../actions/user.action';
import { updateFavoritesFromFSOnCurrency } from '../actions/currencies.action';
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
              favoritesIds: userFS.data()?.favoritesIds
                ? userFS.data()?.favoritesIds
                : [],
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
