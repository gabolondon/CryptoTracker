import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  Observable,
  Subject,
  filter,
  last,
  map,
  takeUntil,
  withLatestFrom,
} from 'rxjs';
import { Favorite } from 'src/app/models/Favorite.interface';
import { AppState } from 'src/app/store/app.state';
import { Constants } from 'src/assets/Constants';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { LiveInfo } from 'src/app/models/Liveinfo.interface';
import {
  selectFavoritesState,
  selectLastDayData,
} from 'src/app/store/selectors/favorites.selector';

@Component({
  selector: 'app-favorite-card',
  templateUrl: './favorite-card.component.html',
  styleUrls: ['./favorite-card.component.scss'],
  animations: [
    trigger('growAnimation', [
      transition('* => *', [
        style({ fontWeight: 'normal' }),
        animate('0.3s', style({ fontWeight: 'bold' })),
        animate('0.3s', style({ fontWeight: 'normal' })),
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
  favInfo$: Observable<Favorite> = new Observable();
  favProperties: Favorite = {} as Favorite;
  currencyPar: string = '';
  prevPrice: number = 0;
  change: number = 0;
  logo: string = '';
  isClicked: boolean = false;
  wsPrice$: Observable<number>;
  private destroy$ = new Subject<void>();

  @Output() selectFavotire = new EventEmitter<Favorite>();

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.wsPrice$ = this.store.select('trades').pipe(
      takeUntil(this.destroy$),
      map((state) => {
        const priceInfo = state.find((f) => f.symbol_id === this.favoriteId);
        if (priceInfo) {
          this.prevPrice = priceInfo.price;
          return priceInfo.price;
        } else {
          return this.prevPrice;
        }
      })
    );
    this.store
      .select('favorites')
      .pipe(takeUntil(this.destroy$))
      .subscribe((state) => {
        console.log('veo la data de lastday en favoritos en cajas', state);
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
}
