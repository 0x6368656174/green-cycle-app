import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, interval, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { IActiveBicycle } from '../db';
import * as moment from 'moment';
import { pluralize } from '../pluralize';
import { calculateAmount } from '../price';

@Component({
  selector: 'app-way-info',
  templateUrl: './way-info.component.html',
  styleUrls: ['./way-info.component.scss']
})
export class WayInfoComponent implements OnInit {
  @Input()
  set activeBicycle(bicycle: IActiveBicycle) {
    this.activeBicycle$.next(bicycle);
  }
  activeBicycle$ = new BehaviorSubject<IActiveBicycle | null>(null);
  duration$: Observable<string>;
  mileage$: Observable<string>;
  amount$: Observable<string>;

  constructor() { }

  ngOnInit() {
    const currentTime$ = interval(60000).pipe(
      map(() => moment()),
      startWith(moment()),
    );

    this.duration$ = combineLatest(currentTime$, this.activeBicycle$).pipe(
      map(([currentTime, bicycle]) => {
        const duration = moment.duration(currentTime.diff(moment(bicycle.rentalStart.toDate()))).clone();

        let durationString = '';
        if (duration.days() >= 1) {
          durationString += pluralize(duration.days(), 'д', 'д', 'д');
        }
        if (duration.hours() >= 1) {
          durationString += ' ' + pluralize(duration.hours(), 'ч', 'ч', 'ч');
        }
        if (duration.days() === 0 && duration.minutes() >= 1) {
          durationString += ' ' + pluralize(duration.minutes(), 'мин', 'мин', 'мин');
        }
        if (duration.asMinutes() === 0) {
          durationString = '0 мин';
        }

        return durationString;
      })
    );

    this.mileage$ = this.activeBicycle$.pipe(
      map(bicycle => bicycle.mileage.toFixed(2)),
    );

    this.amount$ = combineLatest(currentTime$, this.activeBicycle$).pipe(
      map(([currentTime, bicycle]) => {
        return calculateAmount(moment(bicycle.rentalStart.toDate()), currentTime).toFixed(0);
      }),
    );
  }

}
