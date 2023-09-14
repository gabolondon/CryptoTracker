import { ActionReducerMap } from '@ngrx/store';
import { Currency } from '../models/Currency.interface';
import { currenciesReducer } from './reducers/currencies.reducer';
import { favoritesReducer } from './reducers/favorites.reducer';

export interface AppState {
  currencies: ReadonlyArray<Currency>;
  favorites: ReadonlyArray<string>;
}

export const ROOT_REDUCERS: ActionReducerMap<AppState> = {
  currencies: currenciesReducer,
  favorites: favoritesReducer,
};
