import { ActionReducerMap } from '@ngrx/store';
import { Currency } from '../models/Currency.interface';
import { currenciesReducer } from './reducers/currencies.reducer';
import { favoritesReducer } from './reducers/favorites.reducer';
import { CurrencyState } from '../models/Currency.state';
import { Favorite } from '../models/Favorite.interface';
import { tradesReducer } from './reducers/trades.reducer';
import { LiveInfo } from '../models/Liveinfo.interface';

import { userReducer } from './reducers/user.reducer';
import { UserState } from '../models/UserState.interface';

export interface AppState {
  currencies: ReadonlyArray<CurrencyState>;
  favorites: ReadonlyArray<Favorite>;
  trades: ReadonlyArray<LiveInfo>;
  user: Readonly<UserState>;
}

export const ROOT_REDUCERS: ActionReducerMap<AppState> = {
  currencies: currenciesReducer,
  favorites: favoritesReducer,
  trades: tradesReducer,
  user: userReducer,
};
