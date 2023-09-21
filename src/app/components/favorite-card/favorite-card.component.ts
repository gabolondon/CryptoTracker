import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject, delay, map, takeUntil } from 'rxjs';
import { Favorite } from 'src/app/models/Favorite.interface';
import { AppState } from 'src/app/store/app.state';
import { Constants } from 'src/assets/Constants';
import { trigger, style, animate, transition } from '@angular/animations';
import { WebsocketService } from 'src/app/services/websocket.service';

@Component({
  selector: 'app-favorite-card',
  templateUrl: './favorite-card.component.html',
  styleUrls: ['./favorite-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('growAnimation', [
      transition('* => *', [
        style({ fontWeight: 'normal' }),
        animate('0.3s', style({ fontWeight: 'bold', fontSize: 15 })),
        animate('0.3s', style({ fontWeight: 'normal', fontSize: 14 })),
      ]),
    ]),
    trigger('clickAnimation', [
      transition('* => *', [
        style({ scale: 1 }),
        animate('0.08s', style({ scale: 0.9 })),
        animate('0.08s', style({ scale: 1 })),
      ]),
    ]),
  ],
})
export class FavoriteCardComponent implements OnInit {
  @Input() favoriteId!: string;
  favProperties: Favorite = {} as Favorite;
  currencyPar: string = '';
  prevPrice: number = 0;
  change: number = 0;
  logo: string = '';
  isClicked: boolean = false;
  wsPrice$: Observable<number>;
  private destroy$ = new Subject<void>();

  @Output() selectFavotire = new EventEmitter<Favorite>();

  constructor(
    private store: Store<AppState>,
    private wsServer: WebsocketService
  ) {}

  ngOnInit(): void {
    // this.wsPrice$ = this.wsServer.dataUpdates$().pipe(
    //   takeUntil(this.destroy$),

    //   delay(100),
    //   map((state) => {
    //     if (state.symbol_id === this.favoriteId) {
    //       this.prevPrice = state.price;
    //       return state.price;
    //     } else {
    //       return this.prevPrice;
    //     }
    //   })
    // );

    this.store.select('favorites').subscribe((state) => {
      const fav = state.find((f) => f.symbol_id === this.favoriteId);
      if (fav) {
        this.currencyPar = fav?.asset_id_quote + '/' + fav?.asset_id_base;
        this.prevPrice = fav?.price;
        this.favProperties = fav;
        this.change = this.prevPrice / fav.last_day_info?.price_open - 1;
        this.logo = Constants.symbols.find(
          (s) => s.asset_id === fav?.asset_id_base
        ).url;
      }
    });
  }

  onFavClicked($event) {
    if ($event) {
      this.isClicked = !this.isClicked;
      console.log('pressed fav', this.favProperties);
      this.selectFavotire.emit(this.favProperties);
    }
  }

  ngOnDestroy() {
    this.wsServer.closeConnection();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
