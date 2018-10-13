import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NearestRentalPointComponent } from './nearest-rental-point.component';

describe('NearestRentalPointComponent', () => {
  let component: NearestRentalPointComponent;
  let fixture: ComponentFixture<NearestRentalPointComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NearestRentalPointComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NearestRentalPointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
