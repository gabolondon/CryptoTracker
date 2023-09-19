import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradesListComponent } from './trades-list.component';

describe('TradesListComponent', () => {
  let component: TradesListComponent;
  let fixture: ComponentFixture<TradesListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TradesListComponent]
    });
    fixture = TestBed.createComponent(TradesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
