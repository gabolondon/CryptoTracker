import { createReducer, on, props } from '@ngrx/store';
import { Favorite } from 'src/app/models/Favorite.interface';
import { LiveInfo } from 'src/app/models/Liveinfo.interface';
import { updateTradesData } from '../actions/trades.action';

export const initialState: ReadonlyArray<LiveInfo> = [];

export const tradesReducer = createReducer(
  initialState,
  on(updateTradesData, (state, { trades }) => {
    const newState = [trades, ...state];
    if (newState.length > 1000) {
      newState.pop();
    }
    return newState;
  })
);
