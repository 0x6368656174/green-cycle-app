import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  templateUrl: 'home-page.component.html',
  styleUrls: ['home-page.component.scss'],
})
export class HomePageComponent implements OnInit, OnDestroy {

  constructor(private firestore: AngularFirestore, private router: Router) {}

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }
}
