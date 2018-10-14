import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, interval, Observable, of, Subject } from 'rxjs';
import { first, map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { IActiveBicycle, IRentalPoint } from '../db';
import { pluralize } from '../pluralize';
import { calculateAmount } from '../price';
import * as moment from 'moment';

@Component({
  selector: 'app-rental-point-info',
  templateUrl: './rental-point-info-page.component.html',
  styleUrls: ['./rental-point-info-page.component.scss'],
})
export class RentalPointInfoPageComponent implements OnInit, OnDestroy {
  id$: Observable<string>;
  rentalPoint$: Observable<IRentalPoint & { id: string }>;
  freeCount$: Observable<string>;
  parkingCount$: Observable<string>;
  activeBicycle$: Observable<IActiveBicycle | null>;
  amount$: Observable<string>;

  private ngUnsubscribe = new Subject();

  constructor(
    private route: ActivatedRoute,
    private firestore: AngularFirestore,
    private auth: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.id$ = this.route.params.pipe(map(params => params['id']));

    this.rentalPoint$ = this.id$.pipe(
      switchMap(id => {
        return this.firestore
          .collection('rentalPoints')
          .doc<IRentalPoint>(id)
          .snapshotChanges();
      }),
      map(change => {
        return {
          ...change.payload.data(),
          id: change.payload.id,
        };
      }),
      takeUntil(this.ngUnsubscribe),
    );

    this.freeCount$ = this.rentalPoint$.pipe(
      map(point => {
        return pluralize(
          point.bicycles.length,
          'Свободный велосипед',
          'Свободных велосипеда',
          'Свободных велосипедов',
        );
      }),
    );

    this.parkingCount$ = this.rentalPoint$.pipe(
      map(point => {
        return pluralize(
          point.capacity - point.bicycles.length,
          'Свободное место',
          'Свободных места',
          'Свободных мест',
        );
      }),
    );

    this.activeBicycle$ = this.auth.clientRef.pipe(
      switchMap(clientRef => {
        if (!clientRef) {
          return of([]);
        }

        return this.firestore
          .collection<IActiveBicycle>('activeBicycles', ref => ref.where('client', '==', clientRef))
          .valueChanges();
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

    this.amount$ = combineLatest(currentTime$, this.activeBicycle$).pipe(
      map(([currentTime, bicycle]) => {
        if (!bicycle) {
          return '';
        }

        return calculateAmount(moment(bicycle.rentalStart.toDate()), currentTime).toFixed(0);
      }),
    );
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  async processBicycle() {
    const activeBicycle = await this.activeBicycle$.pipe(first()).toPromise();

    if (activeBicycle) {
      this.router.navigate(['/return-bicycle']);
    } else {
      this.router.navigate(['/get-bicycle']);
    }
  }
}
