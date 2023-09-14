import { Currency } from 'src/app/models/Currency.interface';
import { createAction, props } from '@ngrx/store';

export const getAllCurrencies = createAction(
  '[All Currencies] Fetch Currencies',
  props<{ currencies: Currency[] }>()
);
export const getCurrency = createAction(
  '[Currency] Fetch Currency',
  props<{ asset: string }>()
);
