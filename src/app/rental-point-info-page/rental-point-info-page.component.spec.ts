import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RentalPointInfoPageComponent } from './rental-point-info-page.component';

describe('RentalPointInfoPageComponent', () => {
  let component: RentalPointInfoPageComponent;
  let fixture: ComponentFixture<RentalPointInfoPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RentalPointInfoPageComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RentalPointInfoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
