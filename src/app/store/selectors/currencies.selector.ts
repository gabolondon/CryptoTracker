import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AppState } from '../app.state';

// export const selectCurrencies = createFeatureSelector<AppState>('currencies');
export const selectCurrencies = (state: AppState) => state.currencies;
export const selectFavorites = (state: AppState) => state.favorites;

export const selectCurrenciesState = createSelector(
  selectCurrencies,
  (state) => state
);
