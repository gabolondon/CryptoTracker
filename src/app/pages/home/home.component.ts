import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { CurrencyApiService } from 'src/app/services/currency-api.service';
import { Currency } from 'src/app/models/Currency.interface';
import { Store } from '@ngrx/store';
import { getAllCurrencies } from 'src/app/store/actions/currencies.action';
import { AppState } from 'src/app/store/app.state';
import {
  addFavorite,
  removeFavorite,
} from 'src/app/store/actions/favorites.action';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  bannerData: any;
  currencies$: Observable<Currency[]> = new Observable<Currency[]>();
  baseCurrency: string = 'USD';
  favorites: string[] = [];
  dataSource!: MatTableDataSource<any>;
  displayedNamesColumns: string[] = [
    'asset_id_quote',
    'price',
    'volume_1day_usd',
    'favorite',
  ];

  constructor(
    private coinApi: CurrencyApiService,
    private router: Router,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.getAllData();
    this.store.select('favorites').subscribe((state) => {
      this.favorites = [...state];
    });
  }

  onSelectFavotire(event: Currency) {
    if (this.favorites.find((fav) => fav === event.symbol_id)) {
      this.favorites = this.favorites.filter((fav) => fav !== event.symbol_id);
      this.store.dispatch(removeFavorite({ symbolId: event.symbol_id }));
    } else {
      this.favorites.push(event.symbol_id);
      this.store.dispatch(addFavorite({ symbolId: event.symbol_id }));
    }
    console.log(this.favorites);
  }

  getAllData() {
    this.coinApi.getAllCurrencies(this.baseCurrency).subscribe((res) => {
      console.log('respuesta de api', res);
      this.bannerData = res;
      this.dataSource = new MatTableDataSource(this.bannerData.slice(0, 20));
      this.store.dispatch(getAllCurrencies({ currencies: res }));
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
