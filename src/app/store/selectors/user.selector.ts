import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AppState } from '../app.state';

// export const selectCurrencies = createFeatureSelector<AppState>('currencies');
export const selectUser = (state: AppState) => state.user;

export const selectUserfavorites = createSelector(
  selectUser,
  (state) => state.favoritesIds
);
export const selectUserinfo = (state: AppState) => state.user;
