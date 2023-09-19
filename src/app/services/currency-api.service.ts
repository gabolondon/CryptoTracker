import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/enviroments/enviroment';
import { Currency } from '../models/Currency.interface';
import { Observable, delay, from, map, switchMap, tap } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { Constants } from 'src/assets/Constants';
import * as moment from 'moment';
import { HistoricalData } from '../models/HistoricalData.interface';

@Injectable({
  providedIn: 'root',
})
export class CurrencyApiService {
  private headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-CoinAPI-Key': environment.API_KEY,
    });
  }

  getAllCurrencies(baseCurrency: string) {
    console.log('Httprequest made on getAllCurrencies', baseCurrency);
    const url = `${environment.BASE_URL}/symbols?filter_exchange_id=COINBASE&filter_asset_id=${baseCurrency}`;
    // return this.http
    //   .get<Currency[]>(url, { headers: this.headers })
    //   .pipe(
    //     map((currency) =>
    //       currency.sort((a, b) => b.volume_1day_usd - a.volume_1day_usd)
    //     )
    //   );
    return new Observable<Currency[]>((observer) => {
      return observer.next(Constants.API_RES as Currency[]);
    }).pipe(
      map((currency) =>
        currency.sort((a, b) => b.volume_1day_usd - a.volume_1day_usd)
      ),
      delay(600)
    );
  }

  getCurrency(asset: string) {
    return this.http.get<Currency>(
      `${environment.BASE_URL}/exchangerate/${asset}/USD`,
      { headers: this.headers }
    );
  }

  getHistoricalData(symbolId: string) {
    // return this.http.get<HistoricalData[]>(
    //   `${
    //     environment.BASE_URL
    //   }/ohlcv/${symbolId}/history?period_id=1DAY&time_start=${moment()
    //     .startOf('month')
    //     .format('YYYY-MM-DDT00:00:00')}`,
    //   { headers: this.headers }
    // );
    return new Observable<HistoricalData[]>((observer) => {
      return observer.next(Constants.HistoricalData as HistoricalData[]);
    }).pipe(delay(600));
  }
}
