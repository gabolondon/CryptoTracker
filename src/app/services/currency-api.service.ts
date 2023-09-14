import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/enviroments/enviroment';
import { Currency } from '../models/Currency.interface';
import { Observable, delay, map } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { Constants } from 'src/assets/Constants';

interface CurrencyList {
  asset_id_base: string;
  rates: Currency[];
}

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
}
