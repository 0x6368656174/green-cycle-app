import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject, combineLatest, of, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, switchMap, takeUntil } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { IActiveBicycle, IRentalPoint } from '../db';
import * as DG from '2gis-maps';
import { findNearest } from 'geolib';
import { isEqual } from 'lodash';
import dotIcon from '../../assets/marker--dot.svg';
import marker0 from '../../assets/markers/0.svg';
import marker1 from '../../assets/markers/1.svg';
import marker2 from '../../assets/markers/2.svg';
import marker3 from '../../assets/markers/3.svg';
import marker4 from '../../assets/markers/4.svg';
import marker5 from '../../assets/markers/5.svg';
import marker6 from '../../assets/markers/6.svg';
import marker7 from '../../assets/markers/7.svg';
import marker8 from '../../assets/markers/8.svg';
import marker9 from '../../assets/markers/9.svg';
import marker10 from '../../assets/markers/10.svg';
import marker11 from '../../assets/markers/11.svg';
import marker12 from '../../assets/markers/12.svg';
import marker13 from '../../assets/markers/13.svg';
import marker14 from '../../assets/markers/14.svg';
import marker15 from '../../assets/markers/15.svg';
import marker16 from '../../assets/markers/16.svg';
import marker17 from '../../assets/markers/17.svg';
import marker18 from '../../assets/markers/18.svg';
import marker19 from '../../assets/markers/19.svg';
import marker20 from '../../assets/markers/20.svg';
import marker21 from '../../assets/markers/21.svg';
import marker22 from '../../assets/markers/22.svg';
import marker23 from '../../assets/markers/23.svg';
import marker24 from '../../assets/markers/24.svg';
import { GeolocationService } from '../geolocation.service';
import * as firebase from 'firebase/app';
import '@firebase/firestore';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input()
  set rentalPointId(id: string) {
    this.rentalPointId$.next(id);
  }
  private rentalPointId$ = new BehaviorSubject<string | undefined>(undefined);

  @Output()
  nearestRentalPoint = new EventEmitter<string>();

  @ViewChild('map')
  private mapElement: ElementRef<HTMLDivElement>;

  private map;
  private rentalPointsMarkers = {};
  private ngUnsubscribe = new Subject();
  private myMarker;

  constructor(
    private firestore: AngularFirestore,
    private router: Router,
    private geolocation: GeolocationService,
    private auth: AuthService,
  ) {}

  ngOnInit(): void {
    this.map = DG.map(this.mapElement.nativeElement, {
      center: [50.263931, 127.531805],
      zoom: 13,
      zoomControl: false,
      fullscreenControl: false,
    });

    const rentalPointsChanges$ = this.rentalPointId$
      .pipe(
        switchMap(id => {
          if (id === undefined) {
            return this.firestore.collection<IRentalPoint>('rentalPoints').stateChanges();
          }

          return this.firestore
            .collection<IRentalPoint>('rentalPoints', ref =>
              ref.where(firebase.firestore.FieldPath.documentId(), '==', id),
            )
            .stateChanges();
        }),
      )
      .pipe(takeUntil(this.ngUnsubscribe));

    this.rentalPointId$
      .pipe(
        filter((id): id is string => !!id),
        switchMap(id =>
          this.firestore
            .collection('rentalPoints')
            .doc<IRentalPoint>(id)
            .valueChanges(),
        ),
        takeUntil(this.ngUnsubscribe),
      )
      .subscribe(point =>
        this.map.panTo(DG.latLng(point.location.latitude, point.location.longitude)),
      );

    rentalPointsChanges$.subscribe(actions => {
      actions.forEach(action => {
        const id = action.payload.doc.id;
        if (action.type === 'added') {
          const dbPoint = action.payload.doc.data();

          const marker = DG.marker([dbPoint.location.latitude, dbPoint.location.longitude], {
            icon: this.getMarker((dbPoint.bicycles || []).length),
          }).addTo(this.map);
          marker.addEventListener('click', () => {
            this.router.navigate(['/rental-point', id]);
          });

          this.rentalPointsMarkers[id] = marker;
        } else if (action.type === 'modified') {
          const dbPoint = action.payload.doc.data();

          const point = this.rentalPointsMarkers[id];
          if (!point) {
            throw new Error(`Not found point with id = ${id}`);
          }

          point.setLatLng(DG.latLng(dbPoint.location.latitude, dbPoint.location.longitude));
          point.setIcon(this.getMarker((dbPoint.bicycles || []).length));
        } else {
          const point = this.rentalPointsMarkers[id];
          if (!point) {
            throw new Error(`Not found point with id = ${id}`);
          }
          point.removeFrom(this.map);

          delete this.rentalPointsMarkers[id];
        }
      });
    });

    const myIcon = DG.icon({
      iconUrl: dotIcon,
      iconRetinaUrl: dotIcon,
      iconSize: [32, 32],
      iconAnchor: [16, 14],
      popupAnchor: [0, 0],
      shadowUrl: undefined,
      shadowRetinaUrl: undefined,
      shadowSize: [68, 95],
      shadowAnchor: [22, 94],
    });

    // Найдем точки проката
    const rentalPointsPositions$ = this.firestore
      .collection<IRentalPoint>('rentalPoints')
      .snapshotChanges()
      .pipe(
        takeUntil(this.ngUnsubscribe),
        map(changes => {
          return changes.map(change => {
            const location = change.payload.doc.data().location;
            return {
              id: change.payload.doc.id,
              latitude: location.latitude,
              longitude: location.longitude,
            };
          });
        }),
      );

    // Найдем мой активный велосипед
    const activeBicycle$ = this.auth.clientRef.pipe(
      switchMap(clientRef => {
        if (!clientRef) {
          return of([]);
        }

        return this.firestore
          .collection<IActiveBicycle>('activeBicycles', ref => ref.where('client', '==', clientRef))
          .valueChanges();
      }),
      map(bicycles => {
        if (bicycles.length > 0) {
          return bicycles[0];
        }

        return null;
      }),
    );

    // Получим мое текущее положение
    const myLocation$ = combineLatest(this.geolocation.geolocation, activeBicycle$).pipe(
      map(([geolocation, activeBicycle]) => {
        // if (activeBicycle) {
        //   return {
        //     latitude: activeBicycle.location.latitude,
        //     longitude: activeBicycle.location.longitude,
        //   };
        // }

        return geolocation;
      }),
      filter(geolocation => !!geolocation),
    );

    // Установим мой маркер
    myLocation$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(myLocation => {
      if (!this.myMarker) {
        this.myMarker = DG.marker([myLocation.latitude, myLocation.longitude], {
          icon: myIcon,
        }).addTo(this.map);
      } else {
        this.myMarker.setLatLng(DG.latLng(myLocation.latitude, myLocation.longitude));
      }
    });

    // Вернем ближайший прокат
    combineLatest(rentalPointsPositions$, myLocation$)
      .pipe(
        map(([rentalPointsPositions, myLocation]) => {
          const nearest: any = findNearest(myLocation, rentalPointsPositions);
          return rentalPointsPositions[nearest.key];
        }),
        distinctUntilChanged(isEqual),
      )
      .subscribe(point => this.nearestRentalPoint.emit(point.id));
  }

  ngAfterViewInit(): void {
    // FIXME: Костыль, связанный с ion-content
    setTimeout(() => this.map.invalidateSize(), 100);
    setTimeout(() => this.map.invalidateSize(), 250);
    setTimeout(() => this.map.invalidateSize(), 500);
    setTimeout(() => this.map.invalidateSize(), 750);
    setTimeout(() => this.map.invalidateSize(), 1000);
  }

  private getMarker(num: number) {
    let icon;
    switch (num) {
      case 0:
        icon = marker0;
        break;
      case 1:
        icon = marker1;
        break;
      case 2:
        icon = marker2;
        break;
      case 3:
        icon = marker3;
        break;
      case 4:
        icon = marker4;
        break;
      case 5:
        icon = marker5;
        break;
      case 6:
        icon = marker6;
        break;
      case 7:
        icon = marker7;
        break;
      case 8:
        icon = marker8;
        break;
      case 9:
        icon = marker9;
        break;
      case 10:
        icon = marker10;
        break;
      case 11:
        icon = marker11;
        break;
      case 12:
        icon = marker12;
        break;
      case 13:
        icon = marker13;
        break;
      case 14:
        icon = marker14;
        break;
      case 15:
        icon = marker15;
        break;
      case 16:
        icon = marker16;
        break;
      case 17:
        icon = marker17;
        break;
      case 18:
        icon = marker18;
        break;
      case 19:
        icon = marker19;
        break;
      case 20:
        icon = marker20;
        break;
      case 21:
        icon = marker21;
        break;
      case 22:
        icon = marker22;
        break;
      case 23:
        icon = marker23;
        break;
      case 24:
        icon = marker24;
        break;
    }

    return DG.icon({
      iconUrl: icon,
      iconRetinaUrl: icon,
      iconSize: [24, 32],
      iconAnchor: [12, 32],
      popupAnchor: [0, 0],
      shadowUrl: undefined,
      shadowRetinaUrl: undefined,
      shadowSize: [68, 95],
      shadowAnchor: [22, 94],
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
