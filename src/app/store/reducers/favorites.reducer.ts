import { createReducer, on, props } from '@ngrx/store';
import {
  addFavorite,
  addFavoriteData,
  initPriceLive,
  removeFavorite,
  updateFavorites,
  updateHistoricalDataOnFavorite,
  updatePriceOnFav,
} from '../actions/favorites.action';
import { Favorite } from 'src/app/models/Favorite.interface';

export const initialState: ReadonlyArray<Favorite> = [];

export const favoritesReducer = createReducer(
  initialState,
  on(addFavorite, (state, { favorite }) => [...state, favorite]),
  on(addFavoriteData, (state, { favorite }) =>
    state.map((fav) => (fav.symbol_id === favorite.symbol_id ? favorite : fav))
  ),
  on(removeFavorite, (state, { symbolId }) =>
    state.filter((id) => id.symbol_id !== symbolId)
  ),
  on(initPriceLive, (state) => [...state]),
  on(updatePriceOnFav, (state, { symbolId, price }) =>
    state.map((fav) => (fav.symbol_id === symbolId ? { ...fav, price } : fav))
  ),
  on(updateHistoricalDataOnFavorite, (state, { symbolId }) => state),
  on(updateFavorites, (state, { favorites }) => [...favorites])
);
