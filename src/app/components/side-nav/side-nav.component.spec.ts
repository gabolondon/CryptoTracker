// import { ComponentFixture, TestBed } from '@angular/core/testing';

// import { SideNavComponent } from './side-nav.component';

// describe('SideNavComponent', () => {
//   let component: SideNavComponent;
//   let fixture: ComponentFixture<SideNavComponent>;

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       declarations: [SideNavComponent],
//     });
//     fixture = TestBed.createComponent(SideNavComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
// import { TestBed } from '@angular/core/testing';
// import { RouterTestingModule } from '@angular/router/testing';
// import { Subject } from 'rxjs';
// import { take } from 'rxjs/operators';
// import { SideNavComponent } from './side-nav.component';
// import { UserService } from 'src/app/services/user.service';
// import { Router } from '@angular/router';
// import { Store } from '@ngrx/store';
// import { AppState } from 'src/app/store/app.state';

// describe('SideNavComponent', () => {
//   let component: SideNavComponent;
//   let userService: UserService;
//   let router: Router;
//   let store: Store<AppState>;

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       imports: [RouterTestingModule],
//       providers: [UserService, Store],
//       declarations: [SideNavComponent],
//     }).compileComponents();

//     component = TestBed.createComponent(SideNavComponent).componentInstance;
//     userService = TestBed.inject(UserService);
//     router = TestBed.inject(Router);
//     store = TestBed.inject(Store);
//   });

//   afterEach(() => {
//     TestBed.resetTestingModule();
//   });

//   it('should create the component', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should set the selected property to "/dashboard/home" when onHomeNav is called', () => {
//     component.onHomeNav(null);
//     expect(component.selected).toBe('/dashboard/home');
//   });

//   it('should navigate to "/dashboard/home" when onHomeNav is called', () => {
//     const navigateSpy = spyOn(router, 'navigate');
//     component.onHomeNav(null);
//     expect(navigateSpy).toHaveBeenCalledWith(['dashboard/home']);
//   });

//   it('should set the selected property to "/dashboard/favorites" when onFavNav is called', () => {
//     component.onFavNav(null);
//     expect(component.selected).toBe('/dashboard/favorites');
//   });

//   it('should navigate to "/dashboard/favorites" when onFavNav is called', () => {
//     const navigateSpy = spyOn(router, 'navigate');
//     component.onFavNav(null);
//     expect(navigateSpy).toHaveBeenCalledWith(['dashboard/favorites']);
//   });

//   it('should call the SignOut method of the userService when onLogOut is called', () => {
//     const signOutSpy = spyOn(userService, 'SignOut');
//     component.onLogOut(null);
//     expect(signOutSpy).toHaveBeenCalled();
//   });

//   it('should navigate to "/sign-in" when onLogOut is called', () => {
//     const navigateSpy = spyOn(router, 'navigate');
//     component.onLogOut(null);
//     expect(navigateSpy).toHaveBeenCalledWith(['sign-in']);
//   });

//   it('should unsubscribe from the destroy$ subject when ngOnDestroy is called', () => {
//     const nextSpy = spyOn(component.destroy$, 'next');
//     const completeSpy = spyOn(component.destroy$, 'complete');
//     component.ngOnDestroy();
//     expect(nextSpy).toHaveBeenCalled();
//     expect(completeSpy).toHaveBeenCalled();
//   });

//   it('should set the userData property when the store emits a value', () => {
//     const userData = { name: 'John Doe' };
//     const selectSpy = spyOn(store, 'select').and.returnValue({
//       pipe: () => ({
//         subscribe: (callback) => callback(userData),
//       }),
//     });
//     component.ngOnInit();
//     expect(selectSpy).toHaveBeenCalledWith('user');
//     expect(component.userData).toEqual(userData);
//   });

//   it('should update the selected property when the router events emit a value', () => {
//     const url = '/dashboard/favorites';
//     const mapSpy = spyOn(component.router.events, 'pipe').and.returnValue({
//       pipe: () => ({
//         subscribe: (callback) => callback(url),
//       }),
//     });
//     component.ngOnInit();
//     expect(mapSpy).toHaveBeenCalled();
//     expect(component.selected).toBe(url);
//   });
// });
