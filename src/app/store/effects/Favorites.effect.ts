import { removeFavorite } from './../actions/favorites.action';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, of } from 'rxjs';
import {
  map,
  catchError,
  mergeMap,
  withLatestFrom,
  concatMap,
} from 'rxjs/operators';
import { CurrencyApiService } from 'src/app/services/currency-api.service';
import { Store, props } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import {
  addFavorite,
  addFavoriteData,
  updateHistoricalDataOnFavorite,
} from '../actions/favorites.action';
import {
  addFavoriteToUser,
  removeFavoriteToUser,
} from '../actions/user.action';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class FavoritesEffects {
  addFavorite$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addFavorite),
      mergeMap((action) => {
        return this.currencyService
          .getHistoricalData(action.favorite.symbol_id)
          .pipe(
            concatMap((currencies) => {
              return (
                of({
                  type: addFavoriteData.type,
                  favorite: {
                    ...action.favorite,
                    last_day_info: currencies[currencies.length - 1],
                    historical_data: currencies,
                  },
                }),
                of({
                  type: addFavoriteToUser.type,
                  favId: {
                    ...action.favorite,
                    last_day_info: currencies[currencies.length - 1],
                  },
                })
              );
            }),
            catchError(() => {
              console.log('error addFavorite$ ');
              return EMPTY;
            })
          );
        // }
      })
    )
  );
  removeFavorite$ = createEffect(() =>
    this.actions$.pipe(
      ofType(removeFavorite),
      mergeMap((action) => {
        return of({
          type: removeFavoriteToUser.type,
          favId: action.symbolId,
        });
      })
    )
  );
  // initPriceUpdate$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(initPriceLive),
  //     withLatestFrom(this.store.select((state) => state.favorites)),
  //     concatMap(([action, favorites]) => {
  //       return this.wsService
  //         .connect(favorites.map((favorite) => favorite.symbol_id))
  //         .pipe(
  //           concatMap((wsRes) => {
  //             return of(
  //               // updatePriceOnFav({
  //               //   symbolId: wsRes.symbol_id,
  //               //   price: wsRes.price,
  //               // }),
  //               updateTradesData({ trades: wsRes })
  //             );
  //           }),
  //           filter((actions) => actions !== null)
  //         );
  //     })
  //   )
  // );

  updateHistoricalData$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(updateHistoricalDataOnFavorite),
      withLatestFrom(this.store.select((state) => state.favorites)),
      mergeMap(([action, favorites]) => {
        const prevFav = favorites.find(
          (favorite) => favorite.symbol_id === action.symbolId
        );
        if (favorites.length > 0 && prevFav) {
          return this.currencyService.getHistoricalData(action.symbolId).pipe(
            map((currencies) => ({
              type: addFavoriteData.type,
              favorite: {
                ...prevFav,
                last_day_info: currencies[currencies.length - 1],
                historical_data: currencies,
              },
            })),
            catchError(() => {
              console.log('error updateHistoricalData$');
              return EMPTY;
            })
          );
        } else {
          return EMPTY;
        }
      })
    );
  });

  constructor(
    private actions$: Actions,
    private currencyService: CurrencyApiService,
    private store: Store<AppState>,
    private _snackBar: MatSnackBar
  ) {}
}
