import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject, delay, of, takeUntil } from 'rxjs';
import { LiveInfo } from 'src/app/models/Liveinfo.interface';
import { WebsocketService } from 'src/app/services/websocket.service';
import { AppState } from 'src/app/store/app.state';

@Component({
  selector: 'app-trades-list',
  templateUrl: './trades-list.component.html',
  styleUrls: ['./trades-list.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TradesListComponent {
  buyTrades: LiveInfo[] = [];
  sellTrades: LiveInfo[];
  destroy$: Subject<void> = new Subject<void>();
  tradesInfo: LiveInfo[] = [];

  constructor(private wsService: WebsocketService) {}

  @Input() symbolId: string;
  ngOnInit() {
    this.wsService
      .dataUpdates$()
      .pipe(delay(100), takeUntil(this.destroy$))
      .subscribe((data) => {
        if (data?.symbol_id) {
          if (this.tradesInfo.length > 1000) {
            this.tradesInfo.pop();
          }
          this.tradesInfo.unshift(data);
          this.filterBuySel();
        }
      });
  }

  ngOnChanges() {
    if (this.tradesInfo.length > 0) {
      this.filterBuySel();
    }
  }

  filterBuySel(): void {
    if (this.tradesInfo.length > 0) {
      console.log('filterBuySel', this.symbolId);
      const symbolTrades = this.tradesInfo
        .filter((trade) => trade.symbol_id === this.symbolId)
        .map((trade) => {
          return {
            ...trade,
            symbol_id: this.capitalizeFirstWord(trade.symbol_id),
          };
        });

      this.buyTrades = symbolTrades.filter(
        (trade) => trade.taker_side === 'BUY'
      );
      this.sellTrades = symbolTrades.filter(
        (trade) => trade.taker_side === 'SELL'
      );
    }
  }

  capitalizeFirstWord(str: string): string {
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
    this.destroy$.next();
    this.destroy$.complete();
  }
}
