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
import { ButtonComponent } from './button/button.component';

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
    ButtonComponent,
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    ReactiveFormsModule,
    IonicModule.forRoot(),
    AppRoutingModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
