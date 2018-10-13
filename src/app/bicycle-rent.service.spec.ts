import { TestBed } from '@angular/core/testing';

import { BicycleRentService } from './bicycle-rent.service';

describe('BicycleRentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BicycleRentService = TestBed.get(BicycleRentService);
    expect(service).toBeTruthy();
  });
});
