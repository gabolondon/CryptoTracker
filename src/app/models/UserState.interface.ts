import { Favorite } from './Favorite.interface';
import { UserModel } from './UserModel.interface';

export interface UserState extends UserModel {
  favoritesIds: Favorite[];
}
