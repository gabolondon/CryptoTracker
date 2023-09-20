import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject, delay, map, of, take, takeUntil } from 'rxjs';
import { LiveInfo } from 'src/app/models/Liveinfo.interface';
import { WebsocketService } from 'src/app/services/websocket.service';
import { AppState } from 'src/app/store/app.state';

@Component({
  selector: 'app-trades-list',
  templateUrl: './trades-list.component.html',
  styleUrls: ['./trades-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TradesListComponent {
  buyTrades: LiveInfo[] = [];
  testing: string[] = ['1', '2', '3', '4'];
  sellTrades: LiveInfo[];
  price$: Observable<number>;
  desttoy$: Subject<void> = new Subject<void>();
  tradesInfo: LiveInfo[] = [];

  @Input() symbolId: string;
  constructor(private wsService: WebsocketService) {
    //
  }
  ngOnInit(): void {
    this.wsService
      .dataUpdates$()
      .pipe(delay(100))
      .subscribe((data) => {
        if (this.tradesInfo.length > 1000) {
          this.tradesInfo.pop();
        }
        this.tradesInfo.unshift(data);
        this.filterBuySel();
      });
    // this.price$ = this.wsService
    //   .dataUpdates$()
    //   .pipe(map((data: LiveInfo) => data.price));
  }

  ngOnChanges() {
    this.filterBuySel();
  }
  trackByFnSell(index: number, item: LiveInfo) {
    return item.uuid;
  }
  trackByFnBuy(index: number, item: LiveInfo) {
    return item.uuid;
  }

  filterBuySel() {
    const symbolTrades = this.tradesInfo
      .filter((trade) => trade.symbol_id === this.symbolId)
      .map((trade) => {
        return {
          ...trade,
          symbol_id: this.capitalizeFirstWord(trade.symbol_id),
        };
      });
    this.buyTrades = symbolTrades.filter((trade) => trade.taker_side === 'BUY');
    this.sellTrades = symbolTrades.filter(
      (trade) => trade.taker_side === 'SELL'
    );
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
  ngOnDestroy() {
    this.desttoy$.next();
    this.desttoy$.complete();
  }
}
