import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';
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
  price: number = 0;
  change: number = 0;
  logo: string = '';
  isClicked: boolean = false;

  @Output() selectFavotire = new EventEmitter<Favorite>();

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.store.select('favorites').subscribe((state) => {
      const fav = state.find((f) => f.symbol_id === this.favoriteId);
      if (fav) {
        this.currencyPar = fav?.asset_id_quote + '/' + fav?.asset_id_base;
        this.price = fav?.price;
        this.change = fav?.price / fav.last_day_info?.price_open - 1;
        this.favProperties = fav;
        this.logo = Constants.symbols.find(
          (s) => s.asset_id === fav?.asset_id_base
        )?.url;
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
