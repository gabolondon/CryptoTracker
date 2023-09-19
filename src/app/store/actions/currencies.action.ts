import { Currency } from 'src/app/models/Currency.interface';
import { createAction, props } from '@ngrx/store';
import { CurrencyState } from 'src/app/models/Currency.state';

export const LoadCurrencies = createAction('[Currencies] Load Currencies');
export const getAllCurrencies = createAction(
  '[Currencies] Set Loaded Currencies',
  props<{ currencies: CurrencyState[] }>()
);
export const getCurrency = createAction(
  '[Currency] Fetch Currency',
  props<{ asset: string }>()
);
export const addFavoriteOnCurrency = createAction(
  '[Currency] Add Favorite',
  props<{ symbolId: string }>()
);
export const removeFavoriteOnCurrency = createAction(
  '[Currency] Remove Favorite',
  props<{ symbolId: string }>()
);
export const updateFavoritesFromFSOnCurrency = createAction(
  '[Currency] Update Favorites fromFS',
  props<{ favorites: string[] }>()
);
