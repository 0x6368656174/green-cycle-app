import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { IActiveBicycle } from '../db';

@Component({
  selector: 'app-home-page',
  templateUrl: 'home-page.component.html',
  styleUrls: ['home-page.component.scss'],
})
export class HomePageComponent implements OnInit, OnDestroy {
  activeBicycle$: Observable<IActiveBicycle>;

  constructor(private firestore: AngularFirestore, private auth: AuthService) {}

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
  }

  ngOnDestroy(): void {
  }
}
