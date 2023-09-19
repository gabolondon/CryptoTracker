import { UserService } from './../../services/user.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Currency } from 'src/app/models/Currency.interface';
import { Store } from '@ngrx/store';
import {
  addFavoriteOnCurrency,
  LoadCurrencies,
  removeFavoriteOnCurrency,
} from 'src/app/store/actions/currencies.action';
import { AppState } from 'src/app/store/app.state';
import {
  addFavorite,
  removeFavorite,
} from 'src/app/store/actions/favorites.action';
import {
  delay,
  fromEvent,
  last,
  map,
  Observable,
  startWith,
  withLatestFrom,
} from 'rxjs';
import {
  selectCollectionState,
  selectCurrencies,
} from 'src/app/store/selectors/currencies.selector';
import { selectFavoritesIds } from 'src/app/store/selectors/favorites.selector';
import { Favorite } from 'src/app/models/Favorite.interface';
import { Constants } from 'src/assets/Constants';
import {
  fadeInOnEnterAnimation,
  fadeOutOnLeaveAnimation,
} from 'angular-animations';
import { UserState } from 'src/app/models/UserState.interface';
import { addFavoriteToUser } from 'src/app/store/actions/user.action';
import { selectUserinfo } from 'src/app/store/selectors/user.selector';

@Component({
  selector: 'app-all-list',
  templateUrl: './all-list.component.html',
  styleUrls: ['./all-list.component.scss'],
  animations: [fadeInOnEnterAnimation()],
})
export class AllListComponent implements OnInit {
  userInfo: UserState;
  bannerData: any;
  currencies$: Observable<any> = new Observable();
  baseCurrency: string = 'USD';
  favorites: string[] = [];
  dataSource!: MatTableDataSource<any>;
  iconData = Constants.symbols;
  mobileQuery: Observable<MediaQueryList>;
  displayedNamesColumns: string[] = [
    'asset_id_quote',
    'price',
    'volume_1day_usd',
    'favorite',
  ];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private store: Store<AppState>, private userApi: UserService) {
    // this.loadingRows = Array.from({ length: 15 }, (_, index) =>
    //   index.toString()
    // );
    this.mobileQuery = fromEvent<MediaQueryListEvent>(window, 'resize').pipe(
      map(() => window.matchMedia('(max-width: 700px)'))
    );
    this.store.select(selectFavoritesIds).subscribe((state) => {
      this.favorites = [...state];
    });
    this.store.select(selectUserinfo).subscribe((state) => {
      console.log('state de user en all list', state);
      this.userInfo = { ...state };
      if (state?.favoritesIds && state?.favoritesIds.length > 0) {
        this.userApi.SetUserData({
          ...this.userInfo,
          favoritesIds: state.favoritesIds,
        });
      }
    });
  }

  ngOnInit(): void {
    this.getAllData();

    this.mobileQuery
      .pipe(startWith(window.matchMedia('(max-width: 700px)')))
      .subscribe((query) => {
        // console.log('query', query);
        this.displayedNamesColumns = query.matches
          ? ['asset_id_quote', 'price', 'favorite']
          : ['asset_id_quote', 'price', 'volume_1day_usd', 'favorite'];
      });

    this.store.select(selectCollectionState).subscribe((res) => {
      const withLogo = res.map((curr) => {
        return {
          ...curr,
          logo: this.iconData.find((x) => x.asset_id === curr.asset_id_base),
        };
      });
      this.dataSource = new MatTableDataSource([...withLogo]);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
  getAllData() {
    this.store.dispatch(LoadCurrencies());
  }

  onSelectFavotire(event: Currency) {
    if (this.favorites.find((fav) => fav === event.symbol_id)) {
      this.favorites = this.favorites.filter((fav) => fav !== event.symbol_id);
      this.store.dispatch(removeFavorite({ symbolId: event.symbol_id }));
      this.store.dispatch(
        removeFavoriteOnCurrency({ symbolId: event.symbol_id })
      );
    } else {
      this.favorites.push(event.symbol_id);
      this.store.dispatch(
        addFavorite({
          favorite: {
            symbol_id: event.symbol_id,
            asset_id_base: event.asset_id_base,
            asset_id_quote: event.asset_id_quote,
            price: event.price,
            volume_1day: event.volume_1day,
            volume_1day_usd: event.volume_1day_usd,
          } as Favorite,
        })
      );

      this.store.dispatch(addFavoriteOnCurrency({ symbolId: event.symbol_id }));
    }
    console.log(this.favorites);
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
