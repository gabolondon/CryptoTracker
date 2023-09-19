import { Constants } from 'src/assets/Constants';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, skipUntil, switchMap } from 'rxjs';
import { Favorite } from 'src/app/models/Favorite.interface';
import { AppState } from 'src/app/store/app.state';
import { WebsocketService } from 'src/app/services/websocket.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  selectFavoritesHdata,
  selectFavoritesIds,
  selectFavoritesState,
} from 'src/app/store/selectors/favorites.selector';
import {
  initPriceLive,
  updateHistoricalDataOnFavorite,
} from 'src/app/store/actions/favorites.action';
import { Chart, ChartConfiguration, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import * as moment from 'moment';
import { HistoricalData } from 'src/app/models/HistoricalData.interface';
import { tableParams } from './tableParams';

interface ChartDataset {
  data: number[];
  label: string;
  backgroundColor: string;
  borderColor: string;
  pointBackgroundColor: string;
  pointBorderColor: string;
  pointHoverBackgroundColor: string;
  pointHoverBorderColor: string;
  fill: string;
}

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
  clickedRows = new Set<Favorite>();
  selectedFavorite: Favorite;

  currencyPar: string = '';
  price: number = 0;
  change: number = 0;
  logo: string = '';
  mobileQuery: MediaQueryList;

  public lineChartData: ChartConfiguration['data'] = {
    datasets: [this.dataSet],
    labels: [],
  };
  public lineChartOptions: ChartConfiguration['options'] =
    tableParams.lineChartOptions;
  public lineChartType: ChartType = 'line';

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  ngOnInit() {
    this.store.select(selectFavoritesState).subscribe((state) => {
      if (state.length > 0) {
        // console.log('state on favorites changed and sending to wss', state);
        this.favorites = state.map((fav) => fav.symbol_id);
        if (!this.selectedFavorite) {
          this.selectedFavorite = state[0];
          this.updateChartData(
            state[0].historical_data,
            state[0].asset_id_base
          );
          this.filterLiveData(state[0]);
        } else {
          this.filterLiveData(
            state.find((f) => f.symbol_id === this.selectedFavorite?.symbol_id)
          );
        }
      }
    });
    this.clickedRows = new Set<Favorite>();
    this.store.dispatch(initPriceLive());
  }
  ngOnDestroy() {
    if (this.wsService.isConnected) {
      this.wsService.closeConnection();
    }
  }
  onSelectedFavotire(event: Favorite) {
    if (event) {
      this.selectedFavorite = event;
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
        this.store.dispatch(
          updateHistoricalDataOnFavorite({ symbolId: event.symbol_id })
        );
      }
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
      return moment(data.time_open).format('MM-DD-YY');
    });
    this.chart?.update();
  }
  filterLiveData(favorite: Favorite) {
    if (favorite) {
      this.currencyPar =
        favorite?.asset_id_quote + '/' + favorite?.asset_id_base;
      this.price = favorite?.price;
      this.change = favorite?.price / favorite.last_day_info?.price_open - 1;
      this.logo = Constants.symbols.find(
        (s) => s.asset_id === favorite?.asset_id_base
      )?.url;
    }
  }

  // public chartClicked({
  //   event,
  //   active,
  // }: {
  //   event?: ChartEvent;
  //   active?: object[];
  // }): void {
  //   console.log(event, active);
  // }

  // public chartHovered({
  //   event,
  //   active,
  // }: {
  //   event?: ChartEvent;
  //   active?: object[];
  // }): void {
  //   console.log(event, active);
  // }
}
