import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { LiveInfo } from 'src/app/models/Liveinfo.interface';
import { AppState } from 'src/app/store/app.state';

@Component({
  selector: 'app-trades-list',
  templateUrl: './trades-list.component.html',
  styleUrls: ['./trades-list.component.scss'],
})
export class TradesListComponent {
  buyTrades: LiveInfo[] = [];
  testing: string[] = ['1', '2', '3', '4'];
  sellTrades: LiveInfo[];
  @Input() symbolId: string;
  constructor(private store: Store<AppState>) {
    this.store.select('trades').subscribe((data) => {
      const tradesInfo = data
        .filter((trade) => trade.symbol_id === this.symbolId)
        .map((trade) => {
          return {
            ...trade,
            symbol_id: this.capitalizeFirstWord(trade.symbol_id),
          };
        });
      this.buyTrades = tradesInfo.filter((trade) => trade.taker_side === 'BUY');
      this.sellTrades = tradesInfo.filter(
        (trade) => trade.taker_side === 'SELL'
      );
    });
  }
  capitalizeFirstWord(str: string) {
    if (!str || str === '') {
      return '';
    }
    const words = str.split('_');
    if (words.length === 0) {
      return '';
    }
    const firstWord = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    return firstWord;
  }
}
