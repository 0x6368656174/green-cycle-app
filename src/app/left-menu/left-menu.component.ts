import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { IClient } from '../db';
import { formatPhone } from '../utils';

@Component({
  selector: 'app-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.scss'],
})
export class LeftMenuComponent implements OnInit {
  client$: Observable<IClient | null>;
  phone$: Observable<string>;

  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.client$ = this.auth.client;

    this.phone$ = this.client$.pipe(
      map(client => {
        if (!client) {
          return '';
        }

        return formatPhone(client.phone);
      }),
    );
  }
}
