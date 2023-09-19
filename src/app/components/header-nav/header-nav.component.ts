import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-header-nav',
  templateUrl: './header-nav.component.html',
  styleUrls: ['./header-nav.component.scss'],
})
export class HeaderNavComponent {
  selectedCurrency: string = 'USD';
  @Output() onShowDrawer = new EventEmitter();
  onSelectedCurrency(event: string) {
    console.log('sended curr', event);
  }
}
