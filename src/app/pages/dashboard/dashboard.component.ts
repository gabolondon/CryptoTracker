import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { LoadCurrencies } from 'src/app/store/actions/currencies.action';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  showDrawer = true;
  shouldRun = true;

  onShowDrawer($event) {
    console.log('toggle drawer');
    this.showDrawer = !this.showDrawer;
  }
  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private store: Store<AppState>,
    private router: Router
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 720px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);
  }
  ngOnInit(): void {
    this.store.dispatch(LoadCurrencies());
    this.store.select('favorites').subscribe((state) => {
      if (state.length === 0) {
        this.router.navigate(['/dashboard/favorites']);
      }
    });
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }
}
