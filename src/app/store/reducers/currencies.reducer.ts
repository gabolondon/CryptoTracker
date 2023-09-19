import { createReducer, on, props } from '@ngrx/store';
import {
  LoadCurrencies,
  addFavoriteOnCurrency,
  getAllCurrencies,
  getCurrency,
  removeFavoriteOnCurrency,
  updateFavoritesFromFSOnCurrency,
} from '../actions/currencies.action';
import { Currency } from 'src/app/models/Currency.interface';
import { CurrencyState } from 'src/app/models/Currency.state';

export const initialState: ReadonlyArray<CurrencyState> = [];

export const currenciesReducer = createReducer(
  initialState,
  on(LoadCurrencies, (state) => state),
  on(getAllCurrencies, (state, { currencies }) => currencies),
  on(getCurrency, (state) => state),
  on(addFavoriteOnCurrency, (state, { symbolId }) =>
    state.map((currency) =>
      currency.symbol_id === symbolId
        ? { ...currency, favorite: true }
        : currency
    )
  ),
  on(removeFavoriteOnCurrency, (state, { symbolId }) =>
    state.map((currency) =>
      currency.symbol_id === symbolId
        ? { ...currency, favorite: false }
        : currency
    )
  ),
  on(updateFavoritesFromFSOnCurrency, (state, { favorites }) =>
    state.map((currency) =>
      favorites.includes(currency.symbol_id)
        ? { ...currency, favorite: true }
        : { ...currency, favorite: false }
    )
  )
);
