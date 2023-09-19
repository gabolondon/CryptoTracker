import { removeFavorite } from './favorites.action';
import { createAction, props } from '@ngrx/store';
import { Favorite } from 'src/app/models/Favorite.interface';
import { UserModel } from 'src/app/models/UserModel.interface';
import { UserState } from 'src/app/models/UserState.interface';

export const LoginUser = createAction(
  '[User] Update user Data',
  props<{ user: UserModel }>()
);
export const updateFavoritesFromFS = createAction(
  '[User] Update user favorites from FS',
  props<{ user: UserState }>()
);
export const addFavoriteToUser = createAction(
  '[User] Add favorite to user',
  props<{ favId: Favorite }>()
);
export const removeFavoriteToUser = createAction(
  '[User] Remove favorite to user',
  props<{ favId: string }>()
);
