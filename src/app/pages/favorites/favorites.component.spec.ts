import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FavoritesComponent } from './favorites.component';
import {
  fadeInOnEnterAnimation,
  fadeOutOnLeaveAnimation,
} from 'angular-animations';
import { FavoritesListComponent } from 'src/app/components/favorites-list/favorites-list.component';
import { provideMockStore } from '@ngrx/store/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Store, StoreModule } from '@ngrx/store';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('FavoritesComponent', () => {
  let fixture: ComponentFixture<FavoritesComponent>;
  let component: FavoritesComponent;
  let store: jasmine.SpyObj<Store<any>>;

  beforeEach(() => {
    const storeSpy = jasmine.createSpyObj('Store', ['dispatch', 'select']);
    TestBed.configureTestingModule({
      declarations: [FavoritesComponent, FavoritesListComponent],
      providers: [{ provide: Store, useValue: storeSpy }, provideMockStore({})],
      imports: [
        StoreModule.forRoot({}),
        MatSnackBarModule,
        BrowserAnimationsModule,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(FavoritesComponent);
    component = fixture.componentInstance;
  });

  it('should create the FavoritesComponent', () => {
    // Verificar si el componente se crea sin errores
    expect(component).toBeTruthy();
  });

  it('should include app-favorites-list in template', () => {
    // Asegurarse de que el componente incluye app-favorites-list en su template
    const element = fixture.nativeElement;

    // Verificar si el componente app-favorites-list está en el template
    expect(element.querySelector('app-favorites-list')).toBeTruthy();
  });

  // Puedes agregar más pruebas aquí para probar otros aspectos del componente

  afterEach(() => {
    const extraElement = document.querySelector('.extra-element');
    if (extraElement) {
      extraElement.remove(); // Eliminar elementos adicionales del DOM
    }
  });
});
