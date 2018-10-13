import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ModalController } from '@ionic/angular';
import { AuthService } from '../auth.service';
import { BicycleRentService } from '../bicycle-rent.service';
import { IActiveBicycle } from '../db';
import { GetBicyclePageComponent } from '../get-bicycle-page/get-bicycle-page.component';
import { GetBicycleSuccessPageComponent } from '../get-bicycle-success-page/get-bicycle-success-page.component';

@Component({
  selector: 'app-home-page',
  templateUrl: 'home-page.component.html',
  styleUrls: ['home-page.component.scss'],
})
export class HomePageComponent implements OnInit, OnDestroy {
  activeBicycle$: Observable<IActiveBicycle>;
  onTheWay$: Observable<boolean>;

  constructor(private firestore: AngularFirestore, private auth: AuthService, private rent: BicycleRentService, private modalController: ModalController) {}

  ngOnInit(): void {
    // Найдем мой активный велосипед
    this.activeBicycle$ = this.auth.clientRef.pipe(
      switchMap(clientRef => {
        if (!clientRef) {
          return of([]);
        }

        return  this.firestore.collection<IActiveBicycle>(
          'activeBicycles',
          ref => ref.where('client', '==', clientRef),
        ).valueChanges();
      }),
      map(bicycles => {
        if (bicycles.length > 0) {
          return bicycles[0];
        }

        return null;
      }),
    );

    this.onTheWay$ = this.activeBicycle$.pipe(
      map(bicycle => !!bicycle),
    );

    // setTimeout(async () => {
    //     // this.rent.onRentalPointFound('fHdyedG9yIa2qxeHBafO');
    //     const getBicycleModal = await this.modalController.create({
    //       component: GetBicycleSuccessPageComponent,
    //     });
    //     await getBicycleModal.present();
    //   }, 200
    // );

  }

  ngOnDestroy(): void {
  }
}
