import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthCodePageComponent } from './auth-code-page/auth-code-page.component';
import { AuthPageComponent } from './auth-page/auth-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { RentalPointInfoPageComponent } from './rental-point-info-page/rental-point-info-page.component';

const routes: Routes = [
  { path: '', component: HomePageComponent, },
  { path: 'auth', component: AuthPageComponent, },
  { path: 'auth-code/:id', component: AuthCodePageComponent, },
  { path: 'rental-point/:id', component: RentalPointInfoPageComponent, },
  { path: '**', redirectTo: ''},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
