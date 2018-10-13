import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

interface IGeoCoordinate {
  latitude: number;
  longitude: number;
}

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {
  geolocation = new BehaviorSubject<IGeoCoordinate | null>(null);

  constructor() {
    navigator.geolocation.watchPosition(
      (position) => {
        this.geolocation.next({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (v) => console.log('error', v),
      { timeout: 30000 },
    );
  }
}
