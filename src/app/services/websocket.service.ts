import { Injectable } from '@angular/core';
import { Observable, Subject, EMPTY, of, interval, takeUntil } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from 'src/enviroments/enviroment';
import { LiveInfo } from '../models/Liveinfo.interface';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.state';
import { selectFavoritesIds } from '../store/selectors/favorites.selector';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  socket$: WebSocketSubject<any>;

  private destroy$ = new Subject<void>();

  constructor(private store: Store<AppState>) {
    this.store
      .select(selectFavoritesIds)
      .pipe(takeUntil(this.destroy$))
      .subscribe((state) => {
        this.hsMessage = state;
      });
  }
  hsMessage: string[];
  public connect(): WebSocketSubject<any> {
    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = webSocket({
        url: 'wss://ws.coinapi.io/v1/',
        openObserver: {
          next: () => {
            this.socket$.next({
              type: 'hello',
              apikey: environment.API_KEY,
              heartbeat: false,
              subscribe_data_type: ['trade'],
              subscribe_filter_symbol_id: this.hsMessage,
            });
          },
        },
      });
    }
    return this.socket$;
  }

  public dataUpdates$() {
    return this.connect().asObservable();
  }

  closeConnection() {
    this.connect().complete();

    this.destroy$.next();
    this.destroy$.complete();
  }

  sendMessage(msg: any) {
    this.socket$.next(msg);
  }
}
