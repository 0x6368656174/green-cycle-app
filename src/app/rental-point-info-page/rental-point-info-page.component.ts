import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { IRentalPoint } from '../db';
import { pluralize } from '../pluralize';

@Component({
  selector: 'app-rental-point-info',
  templateUrl: './rental-point-info-page.component.html',
  styleUrls: ['./rental-point-info-page.component.scss']
})
export class RentalPointInfoPageComponent implements OnInit, OnDestroy {
  id$: Observable<string>;
  rentalPoint$: Observable<IRentalPoint & {id: string}>;
  freeCount$: Observable<string>;
  parkingCount$: Observable<string>;

  private ngUnsubscribe = new Subject();

  constructor(private route: ActivatedRoute, private firestore: AngularFirestore) { }

  ngOnInit(): void {
    this.id$ = this.route.params.pipe(
      map(params => params['id']),
    );

    this.rentalPoint$ = this.id$.pipe(
      switchMap(id => {
        return this.firestore.collection('rentalPoints').doc<IRentalPoint>(id).snapshotChanges();
      }),
      map(change => {
        return {
          ...change.payload.data(),
          id: change.payload.id
        };
      }),
      takeUntil(this.ngUnsubscribe),
    );

    this.freeCount$ = this.rentalPoint$.pipe(
      map(point => {
        return pluralize(point.bicycles.length, 'Свободный велосипед', 'Свободных велосипеда', 'Свободных велосипедов');
      })
    );

    this.parkingCount$ = this.rentalPoint$.pipe(
      map(point => {
        return pluralize(point.capacity - point.bicycles.length, 'Свободное место', 'Свободных места', 'Свободных мест');
      })
    );
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
