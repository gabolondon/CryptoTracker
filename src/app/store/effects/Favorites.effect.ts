import { removeFavorite } from './../actions/favorites.action';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, of } from 'rxjs';
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
} from 'rxjs/operators';
import { CurrencyApiService } from 'src/app/services/currency-api.service';
import { Store, props } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { CurrencyState } from 'src/app/models/Currency.state';
import {
  addFavorite,
  addFavoriteData,
  initPriceLive,
  updateHistoricalDataOnFavorite,
  updatePriceOnFav,
} from '../actions/favorites.action';
import { Constants } from 'src/assets/Constants';
import { WebsocketService } from 'src/app/services/websocket.service';
import { updateTradesData } from '../actions/trades.action';
import {
  addFavoriteToUser,
  removeFavoriteToUser,
} from '../actions/user.action';

@Injectable()
export class FavoritesEffects {
  addFavorite$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addFavorite),
      mergeMap((action) => {
        const favoriteExists = action.favorite?.last_day_info;

        if (favoriteExists) {
          return EMPTY;
        } else {
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
                    favId: action.favorite,
                  })
                );
              }),
              catchError(() => {
                console.log('error');
                return EMPTY;
              })
            );
        }
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

  initPriceUpdate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(initPriceLive),
      withLatestFrom(this.store.select((state) => state.favorites)),
      switchMap(([action, favorites]) => {
        if (favorites.length === 0) {
          return EMPTY;
        } else {
          return this.wsService
            .connect(favorites.map((favorite) => favorite.symbol_id))
            .pipe(
              concatMap((wsRes) => {
                if (wsRes.symbol_id) {
                  return of(
                    updatePriceOnFav({
                      symbolId: wsRes.symbol_id,
                      price: wsRes.price,
                    }),
                    updateTradesData({ trades: wsRes })
                  );
                } else {
                  return of(null);
                }
              }),
              filter((actions) => actions !== null)
            );
        }
      })
    )
  );

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
              console.log('error');
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
    private wsService: WebsocketService,
    private store: Store<AppState>
  ) {}
}
