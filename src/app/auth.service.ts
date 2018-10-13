import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { IClient } from './db';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  client: Observable<IClient | null>;

  constructor(private afAuth: AngularFireAuth, private firestore: AngularFirestore) {
    this.client = this.afAuth.user.pipe(
      switchMap(user => {
        if (!user) {
          return of(null);
        }

        return this.firestore.collection('clients').doc<IClient>(user.uid).valueChanges();
      }),
    );
  }
}
