import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthCodePageComponent } from './auth-code-page/auth-code-page.component';
import { AuthPageComponent } from './auth-page/auth-page.component';
import { AuthGuard } from './auth.guard';
import { HomePageComponent } from './home-page/home-page.component';
import { NotAuthGuard } from './not-auth.guard';
import { RentalPointInfoPageComponent } from './rental-point-info-page/rental-point-info-page.component';
import { TripInformationPageComponent } from './trip-informaion-page/trip-information-page.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      { path: '', component: HomePageComponent, },
      { path: 'rental-point/:id', component: RentalPointInfoPageComponent, },
      { path: 'trip-information', component: TripInformationPageComponent, },
    ],
  },
  { path: 'auth', component: AuthPageComponent, canActivate: [NotAuthGuard], },
  { path: 'auth-code/:id', component: AuthCodePageComponent, canActivate: [NotAuthGuard], },
  { path: '**', redirectTo: ''},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
