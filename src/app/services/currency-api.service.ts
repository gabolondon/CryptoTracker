import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/enviroments/enviroment';
import { Currency } from '../models/Currency.interface';
import {
  EMPTY,
  Observable,
  catchError,
  delay,
  from,
  map,
  switchMap,
  tap,
} from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { Constants } from 'src/assets/Constants';
import { HistoricalData } from '../models/HistoricalData.interface';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class CurrencyApiService {
  private headers: HttpHeaders;

  constructor(private http: HttpClient, private _snackBar: MatSnackBar) {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-CoinAPI-Key': environment.API_KEY,
    });
  }

  getAllCurrencies(baseCurrency: string) {
    console.log('Httprequest made on getAllCurrencies', baseCurrency);
    const url = `${environment.BASE_URL}/symbols?filter_exchange_id=COINBASE&filter_asset_id=${baseCurrency}`;
    return this.http.get<Currency[]>(url, { headers: this.headers }).pipe(
      map((currency) =>
        currency.sort((a, b) => b.volume_1day_usd - a.volume_1day_usd)
      ),
      catchError(() => {
        this._snackBar.open(
          'There is a problem with CoinApi, please try again',
          'Close',
          {
            duration: 2000,
          }
        );
        console.log('error on getAllCurrencies');
        return EMPTY;
      })
    );
    // return new Observable<Currency[]>((observer) => {
    //   return observer.next(Constants.API_RES as Currency[]);
    // }).pipe(
    //   map((currency) =>
    //     currency.sort((a, b) => b.volume_1day_usd - a.volume_1day_usd)
    //   ),
    //   delay(600)
    // );
  }

  getCurrency(asset: string) {
    return this.http.get<Currency>(
      `${environment.BASE_URL}/exchangerate/${asset}/USD`,
      { headers: this.headers }
    );
  }

  getHistoricalData(symbolId: string) {
    const date = new Date();
    date.setDate(1);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);

    const formattedDate = date.toISOString();

    console.log('Httprequest made on getHistoricalData', formattedDate);
    return this.http
      .get<HistoricalData[]>(
        `${environment.BASE_URL}/ohlcv/${symbolId}/history?period_id=4HRS&time_start=${formattedDate}`,
        { headers: this.headers }
      )
      .pipe(
        catchError(() => {
          this._snackBar.open(
            'There is a problem with CoinApi, please try again',
            'Close',
            {
              duration: 2000,
            }
          );
          return EMPTY;
        })
      );
    // return new Observable<HistoricalData[]>((observer) => {
    //   return observer.next(Constants.HistoricalData as HistoricalData[]);
    // }).pipe(delay(600));
  }
}
