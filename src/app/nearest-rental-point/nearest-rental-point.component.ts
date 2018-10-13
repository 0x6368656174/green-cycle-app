import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { IRentalPoint } from '../db';

@Component({
  selector: 'app-nearest-rental-point',
  templateUrl: './nearest-rental-point.component.html',
  styleUrls: ['./nearest-rental-point.component.scss']
})
export class NearestRentalPointComponent implements OnInit {
  private id$ = new Subject<string>();
  @Input() set id(id: string) {
    this.id$.next(id);
  }

  rentalPoint$: Observable<IRentalPoint>;

  constructor(private firestore: AngularFirestore) { }

  ngOnInit() {
    this.rentalPoint$ = this.id$.pipe(
      switchMap(id => {
        return this.firestore.collection('rentalPoints').doc<IRentalPoint>(id).valueChanges();
      }),
    );
  }

}
