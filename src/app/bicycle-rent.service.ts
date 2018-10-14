import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as moment from 'moment';
import { interval, Observable, Subject } from 'rxjs';
import { first, map, takeWhile } from 'rxjs/operators';
import { IActiveBicycle, IClient, IRentalPoint } from './db';
import { ModalController } from '@ionic/angular';
import { AuthService } from './auth.service';
import { GeolocationService } from './geolocation.service';
import { GetBicyclePageComponent } from './get-bicycle-page/get-bicycle-page.component';
import '@firebase/firestore';
import * as firebase from 'firebase/app';
import { GetBicycleSuccessPageComponent } from './get-bicycle-success-page/get-bicycle-success-page.component';
import { calculateAmount } from './price';
import { ReturnBicycleSuccessPageComponent } from './return-bicycle-success-page/return-bicycle-success-page.component';

@Injectable({
  providedIn: 'root',
})
export class BicycleRentService {
  private maxInterval = 5;

  newRentalPointId = new Subject<string>();

  constructor(
    private modalController: ModalController,
    private firestore: AngularFirestore,
    private auth: AuthService,
    private geolocation: GeolocationService,
  ) {
    auth.client.subscribe(async client => {
      if (!client.nfc) {
        return;
      }

      const nfc = client.nfc;
      const clientRef = await this.auth.clientRef.pipe(first()).toPromise();

      await this.firestore
        .collection('clients')
        .doc<IClient>(clientRef.id)
        .update({
          nfc: null,
        });

      this.onRentalPointFound(nfc);
    });
    // const windowAny: any = window;
    // if (windowAny.nfc) {
    //   const nfc = windowAny.nfc;
    //   setTimeout(() => {
    //     nfc.beginSession(() => {
    //       nfc.addNdefListener(data => console.log(data), () => console.log('addNdefListener ready'));
    //     });
    //     // nfc.addTagDiscoveredListener(data => console.log(data), () => console.log('addTagDiscoveredListener ready'));
    //     // nfc.addNdefFormatableListener(data => console.log(data), () => console.log('addNdefFormatableListener ready'));
    //     // nfc.addMimeTypeListener('text/gc', data => console.log(data), () => console.log('addMimeTypeListener ready'));
    //   }, 4000);
    //   // nfc.addMimeTypeListener('text/gc', async data => {
    //   //   console.log('read from NFC', data);
    //   //   const payload = data.tag.ndefMessage[0].payload;
    //   //   const rentalPointId = windowAny.nfc.bytesToString(payload).substring(3);
    //   //
    //   //   this.newRentalPointId.next(rentalPointId);
    //   //   await this.onRentalPointFound(rentalPointId);
    //   // }, () => console.log('NFC ready'),
    //   //   (error) => console.error(error));
    // }
  }

  async onRentalPointFound(rentalPointId: string) {
    const open = moment()
      .add(this.maxInterval, 's')
      .toDate();
    const rentalPointRef = this.firestore
      .collection('rentalPoints')
      .doc<IRentalPoint>(rentalPointId);
    const rentalPoint: IRentalPoint = await rentalPointRef
      .valueChanges()
      .pipe(first())
      .toPromise();
    if (!rentalPoint || rentalPoint.bicycles.length === 0) {
      console.log(`Not found rental point id = ${rentalPointId}`);
      return;
    }

    const clientRef = await this.auth.clientRef.pipe(first()).toPromise();
    const location = await this.geolocation.geolocation.pipe(first()).toPromise();

    // Попробуем найти уже активный велосипед
    const activeBicycle = await this.firestore
      .collection<IActiveBicycle>('activeBicycles', ref => ref.where('client', '==', clientRef))
      .snapshotChanges()
      .pipe(
        map(changes => {
          if (changes.length > 0) {
            return {
              ...changes[0].payload.doc.data(),
              id: changes[0].payload.doc.id,
            };
          }

          return null;
        }),
        first(),
      )
      .toPromise();

    if (activeBicycle) {
      // МЫ УЖЕ В ДОРОГЕ, СТАВИМ ВЕЛОСИПЕД
      const bicycleRef = this.firestore.collection('bicycles').doc<IActiveBicycle>(activeBicycle.id)
        .ref;

      // Проверим, что в точке проката есть велики
      if (rentalPoint.bicycles.length === 0) {
        return;
      }

      // Откроем точку проката
      await rentalPointRef.update({
        openTo: open as any,
      });

      // Забираем ставим велик
      const bicycles = [...rentalPoint.bicycles, bicycleRef];

      // Сохраним велосипеды
      await rentalPointRef.update({
        bicycles,
      });

      // Удаляем активный велосипед
      await this.firestore
        .collection('activeBicycles')
        .doc(bicycleRef.id)
        .delete();

      const currentTime = moment();
      const rentalStart = moment(activeBicycle.rentalStart.toDate());
      const duration = moment.duration(currentTime.diff(moment(rentalStart)));

      // Покажем диалоговое окно
      const rentalBicycleSuccessModal = await this.modalController.create({
        component: ReturnBicycleSuccessPageComponent,
        componentProps: {
          amount: calculateAmount(rentalStart, currentTime),
          duration,
          mileage: activeBicycle.mileage,
        },
      });
      await rentalBicycleSuccessModal.present();
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

      // Забираем первый попавшийся велик
      const bicycles = [...rentalPoint.bicycles];
      const bicycleRef = bicycles.pop();

      // Сохраним велосипеды
      await rentalPointRef.update({
        bicycles,
      });

      // Добавим активный велосипед
      await this.firestore
        .collection('activeBicycles')
        .doc(bicycleRef.id)
        .set({
          client: clientRef,
          location,
          mileage: 0,
          rentalStart: firebase.firestore.FieldValue.serverTimestamp(),
          route: [location],
        });

      // Покажем диалоговое окно
      const getBicycleSuccessModal = await this.modalController.create({
        component: GetBicycleSuccessPageComponent,
      });
      await getBicycleSuccessModal.present();
      await getBicycleModal.dismiss();
    }
  }
}
