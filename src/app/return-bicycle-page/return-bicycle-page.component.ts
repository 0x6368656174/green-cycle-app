import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';

@Component({
  selector: 'app-return-bicycle-page',
  templateUrl: './return-bicycle-page.component.html',
  styleUrls: ['./return-bicycle-page.component.scss']
})
export class ReturnBicyclePageComponent implements OnInit {

  constructor(private location: Location) { }

  ngOnInit() {
  }

  back() {
    this.location.back();
  }
}
