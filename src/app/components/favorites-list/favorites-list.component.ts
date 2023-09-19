import { Constants } from 'src/assets/Constants';
import { Component, OnInit, ViewChild } from '@angular/core';

import { Store } from '@ngrx/store';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { Favorite } from 'src/app/models/Favorite.interface';
import { AppState } from 'src/app/store/app.state';
import { WebsocketService } from 'src/app/services/websocket.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { selectFavoritesState } from 'src/app/store/selectors/favorites.selector';
import {
  initPriceLive,
  updateHistoricalDataOnFavorite,
} from 'src/app/store/actions/favorites.action';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { HistoricalData } from 'src/app/models/HistoricalData.interface';
import { ChartDataset, tableParams } from './tableParams';

@Component({
  selector: 'app-favorites-list',
  templateUrl: './favorites-list.component.html',
  styleUrls: ['./favorites-list.component.scss'],
})
export class FavoritesListComponent implements OnInit {
  constructor(
    private store: Store<AppState>,
    private wsService: WebsocketService,
    private _snackBar: MatSnackBar
  ) {}
  favorites: string[] = [];
  dataSet: ChartDataset = {
    data: [],
    label: '',
    ...tableParams.dataSet,
  };
  selectedFavorite: Favorite;
  selectedFav: Favorite;

  currencyPar: string = '';
  price: number = 0;
  change: number = 0;
  logo: string = '';
  mobileQuery: MediaQueryList;
  private destroy$ = new Subject<void>();

  public lineChartData: ChartConfiguration['data'] = {
    datasets: [this.dataSet],
    labels: [],
  };
  public lineChartOptions: ChartConfiguration['options'] =
    tableParams.lineChartOptions;
  public lineChartType: ChartType = 'line';

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  ngOnInit() {
    this.store
      .select(selectFavoritesState)
      .pipe(takeUntil(this.destroy$))
      .subscribe((state) => {
        if (state.length > 0) {
          const favIds = state.map((fav) => fav.symbol_id);
          this.favorites = favIds;
          if (!this.selectedFavorite) {
            this.selectedFavorite = state[0];

            this.onSelectedFavotire(state[0]);
          } else {
            const favFiltered = state.find(
              (f) => f.symbol_id === this.selectedFavorite?.symbol_id
            );
            this.filterLiveData(favFiltered);
            this.updateChartData(
              favFiltered.historical_data,
              favFiltered.asset_id_base + '/' + favFiltered.asset_id_quote
            );
          }
        }
      });
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.wsService.closeConnection();
  }
  onSelectedFavotire(event: Favorite) {
    if (event) {
      this.selectedFavorite = event;
      this.store.dispatch(
        updateHistoricalDataOnFavorite({ symbolId: event.symbol_id })
      );
      this.filterLiveData(event);

      if (event.historical_data?.length > 0) {
        this.updateChartData(
          event.historical_data,
          event.asset_id_base + '/' + event.asset_id_quote
        );
      } else {
        this._snackBar.open('No historical data found, try again...', 'OK', {
          duration: 3000,
        });
      }

      this.store.dispatch(initPriceLive());
      console.log('dataSet', this.dataSet);
    }
  }
  updateChartData(updatedData: HistoricalData[], label: string) {
    if (!updatedData || updatedData.length === 0) {
      return;
    }
    this.dataSet = {
      ...this.dataSet,
      data: updatedData.map((data) => {
        return data.price_open;
      }),
      label: label || '',
    };
    this.lineChartData.datasets[0] = this.dataSet;
    this.lineChartData.labels = updatedData.map((data) => {
      const date = new Date(data.time_open);
      return `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`;
    });
    this.chart?.update();
  }
  filterLiveData(favorite: Favorite) {
    if (favorite) {
      this.currencyPar =
        favorite?.asset_id_quote + '/' + favorite?.asset_id_base;
      this.price = favorite.price;
      this.change = favorite.price / favorite.last_day_info?.price_open - 1;
      this.logo = Constants.symbols.find(
        (s) => s.asset_id === favorite?.asset_id_base
      )?.url;
    }
  }
}
