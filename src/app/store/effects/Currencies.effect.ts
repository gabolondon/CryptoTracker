import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import {
  map,
  exhaustMap,
  catchError,
  mergeMap,
  withLatestFrom,
  mergeAll,
  take,
} from 'rxjs/operators';
import { CurrencyApiService } from 'src/app/services/currency-api.service';
import { Store, props } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { CurrencyState } from 'src/app/models/Currency.state';
import { LoadCurrencies, getAllCurrencies } from '../actions/currencies.action';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class CurrenciesEffects {
  loadCurrencies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LoadCurrencies),
      withLatestFrom(this.store.select((state) => state.favorites)), // Import the favorites state from the store
      mergeMap(([action, favorites]) =>
        this.currencyService.getAllCurrencies('USD').pipe(
          map((currencies) => ({
            type: getAllCurrencies.type,
            currencies: currencies.map((currency) => ({
              symbol_id: currency.symbol_id,
              asset_id_base: currency.asset_id_base,
              asset_id_quote: currency.asset_id_quote,
              price: currency.price,
              volume_1day: currency.volume_1day,
              volume_1day_usd: currency.volume_1day_usd,
              favorite: favorites.find(
                (f) => f.symbol_id === currency.symbol_id || false
              ),
            })),
          })),

          catchError(() => {
            this._snackBar.open(
              'There is a problem with CoinApi, please try again',
              'Close',
              {
                duration: 2000,
              }
            );
            console.log('error on loadCurrencies$ ');
            return EMPTY;
          })
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private currencyService: CurrencyApiService,
    private store: Store<AppState>,
    private _snackBar: MatSnackBar
  ) {}
}
