import { createReducer, on, props } from '@ngrx/store';

import {
  addFavoriteToUser,
  LoginUser,
  removeFavoriteToUser,
  updateFavoritesFromFS,
} from '../actions/user.action';
import { UserState } from 'src/app/models/UserState.interface';

export const initialState: Readonly<UserState> = {
  uid: '',
  email: '',
  displayName: '',
  photoURL: '',
  emailVerified: false,
  favoritesIds: [],
};

export const userReducer = createReducer(
  initialState,
  on(LoginUser, (state, { user }) => ({
    ...user,
    favoritesIds: [],
  })),
  on(updateFavoritesFromFS, (state, { user }) => ({
    ...user,
  })),
  on(addFavoriteToUser, (state, { favId }) => ({
    ...state,
    favoritesIds: state.favoritesIds.concat(favId),
  })),
  on(removeFavoriteToUser, (state, { favId }) => ({
    ...state,
    favoritesIds: state.favoritesIds.filter((id) => id.symbol_id !== favId),
  }))
);
