import { Component, Input, OnInit } from '@angular/core';
import { interval, Observable } from 'rxjs';
import { map, startWith, takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-get-bicycle-page',
  templateUrl: './get-bicycle-page.component.html',
  styleUrls: ['./get-bicycle-page.component.scss']
})
export class GetBicyclePageComponent implements OnInit {
  @Input() maxInterval = 5;
  interval$: Observable<string>;

  constructor() { }

  async ngOnInit() {
    this.interval$ = interval(1000).pipe(
      startWith(0),
      map(v => this.maxInterval - v),
      takeWhile(v => v >= 0),
      map(v => {
        if (v < 10) {
          return `0${v}`;
        }

        return v.toString();
      })
    );
  }

}
