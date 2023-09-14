import { Currency } from 'src/app/models/Currency.interface';
import { createAction, props } from '@ngrx/store';

export const addFavorite = createAction(
  '[Favorites] Add Favorite',
  props<{ symbolId: string }>()
);
export const removeFavorite = createAction(
  '[Favorites] Remove Favorite',
  props<{ symbolId: string }>()
);
