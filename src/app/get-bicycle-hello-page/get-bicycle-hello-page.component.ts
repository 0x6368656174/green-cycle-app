import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-get-bicycle-hello-page',
  templateUrl: './get-bicycle-hello-page.component.html',
  styleUrls: ['./get-bicycle-hello-page.component.scss'],
})
export class GetBicycleHelloPageComponent implements OnInit {
  constructor(private location: Location) {}

  ngOnInit() {}

  back() {
    this.location.back();
  }
}
