import { DocumentReference } from '@angular/fire/firestore';
import { Timestamp, GeoPoint } from '@firebase/firestore-types';

export interface IRentalPoint {
  readonly address: string;
  readonly capacity: number;
  readonly bicycles: DocumentReference[];
  readonly location: GeoPoint;
  readonly openTo: Timestamp;
}

export interface IBicycle {
  readonly name: string;
}

export interface IClient {
  readonly phone: number;
  readonly card: string;
  readonly nfc: string;
}

export interface IActiveBicycle {
  readonly client: DocumentReference;
  readonly rentalStart: Timestamp;
  readonly mileage: number;
  readonly location: GeoPoint;
}
