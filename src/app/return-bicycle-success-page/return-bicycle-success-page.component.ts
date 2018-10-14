import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import * as moment from 'moment';

@Component({
  selector: 'app-return-bicycle-success-page',
  templateUrl: './return-bicycle-success-page.component.html',
  styleUrls: ['./return-bicycle-success-page.component.scss'],
})
export class ReturnBicycleSuccessPageComponent implements OnInit {
  @Input()
  duration: moment.Duration;
  @Input()
  mileage: number;
  @Input()
  amount: number;

  constructor(private router: Router, private modalController: ModalController) {}

  ngOnInit() {}

  toHome() {
    this.modalController.dismiss();
    this.router.navigate(['/']);
  }
}
