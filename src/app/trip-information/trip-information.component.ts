import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { pluralize } from '../pluralize';

@Component({
  selector: 'app-trip-information',
  templateUrl: './trip-information.component.html',
  styleUrls: ['./trip-information.component.scss']
})
export class TripInformationComponent implements OnInit {
  @Input() border = true;

  mileage$ = new BehaviorSubject(0);
  @Input()
  set mileage(mileage: number) {
    this.mileage$.next(mileage);
  }
  mileageStr$: Observable<string>;

  duration$ = new BehaviorSubject(moment.duration(0));
  @Input()
  set duration(duration: moment.Duration) {
    this.duration$.next(duration);
  }
  durationStr$: Observable<string>;
  durationUnitStr$: Observable<string>;
  ccal$: Observable<string>;
  co2$: Observable<string>;

  constructor() { }

  ngOnInit() {
    this.mileageStr$ = this.mileage$.pipe(
      map(mileage => mileage.toFixed(2)),
    );

    const notNulDuration$ = this.duration$.pipe(
      filter(v => !!v),
    );

    this.durationStr$ = notNulDuration$.pipe(
      filter(v => !!v),
      map(duration => {
        if (duration.asDays() >= 1) {
          if (duration.asDays() % 10 < 0.1) {
            return duration.asDays().toFixed(0);
          }

          return duration.asDays().toFixed(1);
        }
        if (duration.asHours() >= 1) {
          if (duration.asHours() % 10 < 0.1) {
            return duration.asHours().toFixed(0);
          }

          return duration.asHours().toFixed(1);
        }
        if (duration.asMinutes() >= 1) {
          return duration.minutes().toString();
        }

        return '0';
      })
    );

    this.durationUnitStr$ = combineLatest(notNulDuration$, this.durationStr$).pipe(
      map(([duration, durationStr]) => {
        const value = parseFloat(durationStr);

        if (duration.days() >= 1) {
          return pluralize(value, 'День', 'Дня', 'Дней');
        }
        if (duration.hours() >= 1) {
          return pluralize(value, 'Час', 'Часа', 'Часов');
        }

        return pluralize(value, 'Минута', 'Минуты', 'Минут');
      }),
    );

    this.ccal$ = notNulDuration$.pipe(
      map(duration => (duration.asHours() * 500).toFixed(0))
    );

    this.co2$ = notNulDuration$.pipe(
      map(duration => (duration.asHours() * 1.13).toFixed(2))
    );
  }

}
