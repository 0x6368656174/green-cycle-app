import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnBicycleSuccessPageComponent } from './return-bicycle-success-page.component';

describe('ReturnBicycleSuccessPageComponent', () => {
  let component: ReturnBicycleSuccessPageComponent;
  let fixture: ComponentFixture<ReturnBicycleSuccessPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReturnBicycleSuccessPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnBicycleSuccessPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
