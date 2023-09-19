import { Currency } from './Currency.interface';
import { HistoricalData } from './HistoricalData.interface';

export interface Favorite extends Currency {
  last_day_info: HistoricalData;
  historical_data: HistoricalData[];
}
