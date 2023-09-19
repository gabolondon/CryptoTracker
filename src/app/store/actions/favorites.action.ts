import { Currency } from 'src/app/models/Currency.interface';
import { createAction, props } from '@ngrx/store';
import { Favorite } from 'src/app/models/Favorite.interface';
import { LiveInfo } from 'src/app/models/Liveinfo.interface';

export const addFavorite = createAction(
  '[Favorites] Add Favorite',
  props<{ favorite: Favorite }>()
);
export const addFavoriteData = createAction(
  '[Favorites] Add Favorite Data',
  props<{ favorite: Favorite }>()
);
export const removeFavorite = createAction(
  '[Favorites] Remove Favorite',
  props<{ symbolId: string }>()
);
export const initPriceLive = createAction('[Favorites] Init Price Live');
// export const killPriceLive = createAction('[Favorites] Kill Price Live');
export const updatePriceOnFav = createAction(
  '[Favorites] Update Price On Fav',
  props<{ symbolId: string; price: number }>()
);
export const updateHistoricalDataOnFavorite = createAction(
  '[Favorites] Update Historical Data on Favorite',
  props<{ symbolId: string }>()
);
export const updateFavorites = createAction(
  '[Favorites] Update Favorites',
  props<{ favorites: Favorite[] }>()
);
