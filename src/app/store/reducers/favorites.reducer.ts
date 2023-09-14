import { createReducer, on, props } from '@ngrx/store';
import { getAllCurrencies, getCurrency } from '../actions/currencies.action';
import { Currency } from 'src/app/models/Currency.interface';
import { addFavorite, removeFavorite } from '../actions/favorites.action';
import { state } from '@angular/animations';

export const initialState: ReadonlyArray<string> = [];

export const favoritesReducer = createReducer(
  initialState,
  on(addFavorite, (state, { symbolId }) => [...state, symbolId]),
  on(removeFavorite, (state, { symbolId }) =>
    state.filter((id) => id !== symbolId)
  )
);
