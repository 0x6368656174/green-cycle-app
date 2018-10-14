import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TripInformationPageComponent } from './trip-information-page.component';

describe('TripInformationPageComponent', () => {
  let component: TripInformationPageComponent;
  let fixture: ComponentFixture<TripInformationPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TripInformationPageComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripInformationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
