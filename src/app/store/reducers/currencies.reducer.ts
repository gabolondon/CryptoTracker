import { createReducer, on, props } from '@ngrx/store';
import { getAllCurrencies, getCurrency } from '../actions/currencies.action';
import { Currency } from 'src/app/models/Currency.interface';

export const initialState: ReadonlyArray<Currency> = [];

export const currenciesReducer = createReducer(
  initialState,
  on(getAllCurrencies, (_state, { currencies }) => currencies),
  on(getCurrency, (state) => state)
);
