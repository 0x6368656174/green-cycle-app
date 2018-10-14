import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApplicationVerifier } from '@firebase/auth-types';
import '@firebase/auth';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-auth-modal',
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.scss'],
})
export class AuthPageComponent implements OnInit {
  phone = new FormControl('', [Validators.required, Validators.pattern(/\+79\d{9}/)]);

  private recaptchaVerifier: ApplicationVerifier;

  constructor(private afAuth: AngularFireAuth, private router: Router) {}

  ngOnInit() {
    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-verifier', {
      size: 'invisible',
    });
  }

  async submit() {
    if (!this.phone.valid) {
      return;
    }

    const phone = this.phone.value;
    const { verificationId } = await this.afAuth.auth.signInWithPhoneNumber(
      phone,
      this.recaptchaVerifier,
    );

    this.router.navigate(['/auth-code', verificationId]);
  }
}
