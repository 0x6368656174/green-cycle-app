import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as DG from '2gis-maps';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IRentalPoint } from '../db';

@Component({
  selector: 'app-home-page',
  templateUrl: 'home-page.component.html',
  styleUrls: ['home-page.component.scss'],
})
export class HomePageComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('map') private mapElement: ElementRef<HTMLDivElement>;

  width = window.innerWidth;

  private map;
  private rentalPointsMarkers = {};
  private ngUnsubscribe = new Subject();

  constructor(private firestore: AngularFirestore, private router: Router) {}

  ngOnInit(): void {
    this.map = DG.map(this.mapElement.nativeElement, {
      'center': [50.263931, 127.531805],
      'zoom': 13,
      'zoomControl': false,
      'fullscreenControl': false,
    });

    const rentalPoints$ = this.firestore.collection<IRentalPoint>('rentalPoints').stateChanges().pipe(
      takeUntil(this.ngUnsubscribe),
    );

    rentalPoints$.subscribe(actions => {
      actions.forEach(action => {
        const id = action.payload.doc.id;
        if (action.type === 'added') {
          const dbPoint = action.payload.doc.data();

          const marker = DG.marker([dbPoint.latitude, dbPoint.longitude]).addTo(this.map);
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

          point.setLatLng(DG.latLng(dbPoint.latitude, dbPoint.longitude));
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
  }

  ngAfterViewInit(): void {
    // FIXME: Костыль, связанный с ion-content
    setTimeout(() => this.map.invalidateSize(), 100);
    setTimeout(() => this.map.invalidateSize(), 250);
    setTimeout(() => this.map.invalidateSize(), 500);
    setTimeout(() => this.map.invalidateSize(), 750);
    setTimeout(() => this.map.invalidateSize(), 1000);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
