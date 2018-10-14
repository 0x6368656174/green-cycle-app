import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetBicycleSuccessPageComponent } from './get-bicycle-success-page.component';

describe('GetBicycleSuccessPageComponent', () => {
  let component: GetBicycleSuccessPageComponent;
  let fixture: ComponentFixture<GetBicycleSuccessPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GetBicycleSuccessPageComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetBicycleSuccessPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
