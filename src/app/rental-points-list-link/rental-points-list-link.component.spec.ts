import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RentalPointsListLinkComponent } from './rental-points-list-link.component';

describe('RentalPointsListLinkComponent', () => {
  let component: RentalPointsListLinkComponent;
  let fixture: ComponentFixture<RentalPointsListLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RentalPointsListLinkComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RentalPointsListLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
