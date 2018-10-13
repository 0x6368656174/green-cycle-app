import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import { AngularFirestore } from '@angular/fire/firestore';
import { combineLatest, interval, Observable, of } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { IActiveBicycle } from '../db';
import * as moment from 'moment';
import { calculateAmount } from '../price';


@Component({
  selector: 'app-trip-information-page',
  templateUrl: './trip-information-page.component.html',
  styleUrls: ['./trip-information-page.component.scss']
})
export class TripInformationPageComponent implements OnInit {
  amount$: Observable<string>;
  mileage$: Observable<number>;
  duration$: Observable<moment.Duration>;

  constructor(private firestore: AngularFirestore, private auth: AuthService, private location: Location) { }

  ngOnInit() {
    const activeBicycle$ = this.auth.clientRef.pipe(
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

    const currentTime$ = interval(60000).pipe(
      map(() => moment()),
      startWith(moment()),
    );

    this.duration$ = combineLatest(currentTime$, activeBicycle$).pipe(
      map(([currentTime, bicycle]) => {
        return moment.duration(currentTime.diff(moment(bicycle.rentalStart.toDate())));
      })
    );

    this.mileage$ = activeBicycle$.pipe(
      map(bicycle => bicycle.mileage.toFixed(2)),
    );

    this.amount$ = combineLatest(currentTime$, activeBicycle$).pipe(
      map(([currentTime, bicycle]) => {
        if (!bicycle) {
          return '';
        }

        return calculateAmount(moment(bicycle.rentalStart.toDate()), currentTime).toFixed(0);
      }),
    );
  }

  back() {
    this.location.back();
  }
}
