import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-get-bicycle-success-page',
  templateUrl: './get-bicycle-success-page.component.html',
  styleUrls: ['./get-bicycle-success-page.component.scss']
})
export class GetBicycleSuccessPageComponent implements OnInit {
  constructor(private router: Router, private modalController: ModalController) { }

  ngOnInit() {
  }

  toHome() {
    this.modalController.dismiss();
    this.router.navigate(['/']);
  }
}
