import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { MediaMatcher } from '@angular/cdk/layout';
import { Store, StoreModule } from '@ngrx/store';
import { LoadCurrencies } from 'src/app/store/actions/currencies.action';
import { of } from 'rxjs';
import { provideMockStore } from '@ngrx/store/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let store: jasmine.SpyObj<Store<any>>;

  beforeEach(() => {
    const storeSpy = jasmine.createSpyObj('Store', ['dispatch', 'select']);

    TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      providers: [
        MediaMatcher,
        { provide: Store, useValue: storeSpy },
        provideMockStore({}),
      ],
      imports: [StoreModule.forRoot({})],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store) as jasmine.SpyObj<Store<any>>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch LoadCurrencies action on ngOnInit', () => {
    spyOn(store, 'dispatch').and.callThrough();
    component.ngOnInit();
    expect(store.dispatch).toHaveBeenCalledWith(LoadCurrencies());
  });

  it('should unsubscribe from mobileQuery change on ngOnDestroy', () => {
    const mobileQueryListenerSpy = jasmine.createSpy('mobileQueryListener');
    spyOn(component.mobileQuery, 'removeEventListener');
    component['_mobileQueryListener'] = mobileQueryListenerSpy;

    component.ngOnDestroy();

    expect(component.mobileQuery.removeEventListener).toHaveBeenCalledWith(
      'change',
      mobileQueryListenerSpy
    );
  });

  // You can add more tests as needed to cover other component behaviors.
});
