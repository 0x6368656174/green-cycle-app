import { Component, Input, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-icon-button',
  templateUrl: './icon-button.component.html',
  styleUrls: ['./icon-button.component.scss'],
})
export class IconButtonComponent implements OnInit {
  @Input()
  icon: string;
  @Input()
  iconStyle: 'white' | 'green' = 'white';
  @Input()
  menuToggle: false;

  constructor(private menuController: MenuController) {}

  ngOnInit() {}

  click() {
    if (this.menuToggle) {
      this.menuController.open();
    }
  }
}
