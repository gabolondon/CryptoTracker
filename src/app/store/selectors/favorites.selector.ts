import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { state } from '@angular/animations';

// export const selectCurrencies = createFeatureSelector<AppState>('currencies');
export const selectCurrencies = (state: AppState) => state.currencies;
export const selectFavorites = (state: AppState) => state.favorites;

export const selectFavoritesIds = createSelector(selectFavorites, (state) =>
  state.map((favorite) => favorite.symbol_id)
);

export const selectFavoritesHdata = createSelector(selectFavorites, (state) =>
  state.map((favorite) => {
    return {
      symbol_id: favorite.symbol_id,
      historical_data: favorite.historical_data,
    };
  })
);

export const selectFavoritesState = createSelector(selectFavorites, (state) => [
  ...state,
]);

export const selectLastDayData = createSelector(selectFavorites, (state) =>
  state.map((favorite) => ({
    symbol_id: favorite.symbol_id,
    last_day_info: favorite.last_day_info,
  }))
);
