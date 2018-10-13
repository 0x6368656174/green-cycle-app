import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { DocumentReference } from '@firebase/firestore-types';
import { map, switchMap, tap } from 'rxjs/operators';
import { IClient } from './db';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  client: Observable<IClient | null>;
  clientRef: Observable<DocumentReference | null>;

  constructor(private afAuth: AngularFireAuth, private firestore: AngularFirestore) {
    this.clientRef = this.afAuth.user.pipe(
      map(user => {
        if (!user) {
          return null;
        }

        return this.firestore.collection('clients').doc<IClient>(user.uid).ref;
      }),
      tap(() => {
        if ((navigator as any).splashscreen) {
          (navigator as any).splashscreen.hide();
        }
      }),
    );

    this.client = this.clientRef.pipe(
      switchMap(ref => {
        if (!ref) {
          return of(null);
        }

        return this.firestore.collection('clients').doc<IClient>(ref.id).valueChanges();
      }),
    );
  }
}
