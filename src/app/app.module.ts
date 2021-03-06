import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomePageComponent } from './home-page/home-page.component';
import { IconButtonComponent } from './icon-button/icon-button.component';
import { RentalPointInfoPageComponent } from './rental-point-info-page/rental-point-info-page.component';
import { AuthPageComponent } from './auth-page/auth-page.component';
import { AuthCodePageComponent } from './auth-code-page/auth-code-page.component';
import { MapComponent } from './map/map.component';
import { HeaderComponent } from './header/header.component';
import { NearestRentalPointComponent } from './nearest-rental-point/nearest-rental-point.component';
import { RentalPointsListLinkComponent } from './rental-points-list-link/rental-points-list-link.component';
import { LeftMenuComponent } from './left-menu/left-menu.component';
import { WayInfoComponent } from './way-info/way-info.component';
import { TripInformationComponent } from './trip-information/trip-information.component';
import { GetBicyclePageComponent } from './get-bicycle-page/get-bicycle-page.component';
import { GetBicycleSuccessPageComponent } from './get-bicycle-success-page/get-bicycle-success-page.component';
import { TripInformationPageComponent } from './trip-informaion-page/trip-information-page.component';
import { GetBicycleHelloPageComponent } from './get-bicycle-hello-page/get-bicycle-hello-page.component';
import { ReturnBicyclePageComponent } from './return-bicycle-page/return-bicycle-page.component';
import { ReturnBicycleSuccessPageComponent } from './return-bicycle-success-page/return-bicycle-success-page.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    RentalPointInfoPageComponent,
    AuthPageComponent,
    AuthCodePageComponent,
    MapComponent,
    HeaderComponent,
    IconButtonComponent,
    NearestRentalPointComponent,
    RentalPointsListLinkComponent,
    LeftMenuComponent,
    WayInfoComponent,
    TripInformationComponent,
    GetBicyclePageComponent,
    GetBicycleSuccessPageComponent,
    TripInformationPageComponent,
    GetBicycleHelloPageComponent,
    ReturnBicyclePageComponent,
    ReturnBicycleSuccessPageComponent,
  ],
  entryComponents: [
    GetBicyclePageComponent,
    GetBicycleSuccessPageComponent,
    ReturnBicycleSuccessPageComponent,
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    ReactiveFormsModule,
    IonicModule.forRoot(),
    AppRoutingModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
