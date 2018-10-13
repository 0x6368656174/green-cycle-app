import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as moment from 'moment';
import { interval } from 'rxjs';
import { first, map, takeWhile } from 'rxjs/operators';
import { IActiveBicycle, IRentalPoint } from './db';
import { ModalController } from '@ionic/angular';
import { AuthService } from './auth.service';
import { GeolocationService } from './geolocation.service';
import { GetBicyclePageComponent } from './get-bicycle-page/get-bicycle-page.component';
import '@firebase/firestore';
import * as firebase from 'firebase/app';
import { GetBicycleSuccessPageComponent } from './get-bicycle-success-page/get-bicycle-success-page.component';

@Injectable({
  providedIn: 'root',
})
export class BicycleRentService {
  private maxInterval = 5;

  constructor(
              private modalController: ModalController,
              private firestore: AngularFirestore,
              private auth: AuthService,
              private geolocation: GeolocationService,
  ) {
    const windowAny: any = window;
    console.log(windowAny);
    if (windowAny.nfc) {
      windowAny.nfc.addNdefListener(async data => {
        const payload = data.tag.ndefMessage[0].payload;
        const rentalPointId = windowAny.nfc.bytesToString(payload).substring(3);
        console.log('tag data', rentalPointId);

        await this.onRentalPointFound(rentalPointId);
      });
    }
  }

  async onRentalPointFound(rentalPointId: string) {
    const open = moment().add(30, 's').toDate();
    const rentalPointRef = this.firestore.collection('rentalPoints').doc<IRentalPoint>(rentalPointId);
    const rentalPoint: IRentalPoint = await rentalPointRef.valueChanges().pipe(first()).toPromise();
    if (!rentalPoint || rentalPoint.bicycles.length === 0) {
      console.log(`Not found rental point id = ${rentalPointId}`);
      return;
    }

    const clientRef = await this.auth.clientRef.pipe(first()).toPromise();
    const location = await this.geolocation.geolocation.pipe(first()).toPromise();

    console.log(clientRef, location);

    // Попробуем найти уже активный велосипед
    const activeBicycle = await this.firestore.collection<IActiveBicycle>(
      'activeBicycles',
      ref => ref.where('client', '==', clientRef),
    )
      .snapshotChanges()
      .pipe(
        map(changes => {
          if (changes.length > 0) {
            return {
              id: changes[0].payload.doc.id,
            };
          }

          return null;
        }),
        first(),
      ).toPromise();


    if (activeBicycle) {
      // МЫ УЖЕ В ДОРОГЕ, СТАВИМ ВЕЛОСИПЕД
      const bicycleRef = this.firestore.collection('bicycles').doc<IActiveBicycle>(activeBicycle.id).ref;

      // Проверим, что в точке проката есть велики
      if (rentalPoint.bicycles.length === 0) {
        return;
      }

      // Откроем точку проката
      await rentalPointRef.update({
        openTo: open as any,
      });

      // Ждем 5 сек
      const interval$ = interval(1000).pipe(
        map(v => this.maxInterval - v),
        takeWhile(v => v > 0),
      );
      await interval$.toPromise();

      // Через 5 сек забираем ставим велик
      const bicycles = [...rentalPoint.bicycles, bicycleRef];

      // Сохраним велосипеды
      await rentalPointRef.update({
        bicycles,
      });

      // Удаляем активный велосипед
      await this.firestore.collection('activeBicycles').doc(bicycleRef.id).delete();
    } else {
      // ПОЛУЧАЕМ НОВЫЙ ВЕЛОСИПЕД

      // Откроем точку проката
      await rentalPointRef.update({
        openTo: open as any,
      });

      // Покажем диалоговое окно
      const getBicycleModal = await this.modalController.create({
        component: GetBicyclePageComponent,
      });
      await getBicycleModal.present();

      // Ждем 5 сек
      const interval$ = interval(1000).pipe(
        map(v => this.maxInterval - v),
        takeWhile(v => v > 0),
      );
      await interval$.toPromise();

      // Через 5 сек скроем диалоговое окно
      await getBicycleModal.dismiss();

      // Забираем первый попавшийся велик
      const bicycles = [...rentalPoint.bicycles];
      const bicycleRef = bicycles.pop();

      // Сохраним велосипеды
      await rentalPointRef.update({
        bicycles,
      });

      // Добавим активный велосипед
      await this.firestore.collection('activeBicycles').doc(bicycleRef.id).set({
        client: clientRef,
        location,
        mileage: 0,
        rentalStart: firebase.firestore.FieldValue.serverTimestamp(),
        route: [
          location,
        ],
      });

      // Покажем диалоговое окно
      const getBicycleSuccessModal = await this.modalController.create({
        component: GetBicycleSuccessPageComponent,
      });
      await getBicycleSuccessModal.present();
    }
  }
}
