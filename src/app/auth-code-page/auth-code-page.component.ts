import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl, Validators } from '@angular/forms';
import '@firebase/auth';
import { ActivatedRoute, Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { first } from 'rxjs/operators';
import { IClient } from '../db';


@Component({
  selector: 'app-auth-code-page',
  templateUrl: './auth-code-page.component.html',
  styleUrls: ['./auth-code-page.component.scss']
})
export class AuthCodePageComponent implements OnInit {
  code = new FormControl('', [Validators.required, Validators.pattern(/\d{6}/)]);

  private verificationId: string;

  constructor(public afAuth: AngularFireAuth, private route: ActivatedRoute, private router: Router, private firestore: AngularFirestore) { }

  ngOnInit() {
    this.verificationId = this.route.snapshot.params['id'];
  }

  async submit() {
    if (!this.code.valid) {
      return;
    }

    const code = this.code.value;
    const credential = await Promise.resolve(firebase.auth.PhoneAuthProvider.credential(this.verificationId, code.toString()));
    const user = await this.afAuth.auth.signInWithCredential(credential);

    if (!user) {
      return;
    }

    const clientDoc = this.firestore.collection('clients').doc<IClient>(user.uid);
    const client = await clientDoc.valueChanges().pipe(first()).toPromise();
    if (!client) {
      await clientDoc.set({
        phone: parseInt(user.phoneNumber, 10),
        card: 'VISA •••• 4567',
      });
    }

    this.router.navigate(['/']);
  }
}
