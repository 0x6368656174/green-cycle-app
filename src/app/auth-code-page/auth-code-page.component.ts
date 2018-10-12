import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormControl, Validators } from '@angular/forms';
import '@firebase/auth';
import { ActivatedRoute } from '@angular/router';
import * as firebase from 'firebase/app';


@Component({
  selector: 'app-auth-code-page',
  templateUrl: './auth-code-page.component.html',
  styleUrls: ['./auth-code-page.component.scss']
})
export class AuthCodePageComponent implements OnInit {
  code = new FormControl('', [Validators.required]);

  private verificationId: string;

  constructor(public afAuth: AngularFireAuth, private route: ActivatedRoute) { }

  ngOnInit() {
    this.verificationId = this.route.snapshot.params['id'];
  }

  async submit() {
    if (!this.code.valid) {
      return;
    }

    const code = this.code.value;
    const credential = await Promise.resolve(firebase.auth.PhoneAuthProvider.credential(this.verificationId, code));
    await this.afAuth.auth.signInWithCredential(credential);

    console.log('success');
  }
}
