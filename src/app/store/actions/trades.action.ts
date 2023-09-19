import { Currency } from 'src/app/models/Currency.interface';
import { createAction, props } from '@ngrx/store';
import { Favorite } from 'src/app/models/Favorite.interface';
import { LiveInfo } from 'src/app/models/Liveinfo.interface';

export const updateTradesData = createAction(
  '[Trades] Update Trades Data',
  props<{ trades: LiveInfo }>()
);
