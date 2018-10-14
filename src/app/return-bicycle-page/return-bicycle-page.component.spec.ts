import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnBicyclePageComponent } from './return-bicycle-page.component';

describe('ReturnBicyclePageComponent', () => {
  let component: ReturnBicyclePageComponent;
  let fixture: ComponentFixture<ReturnBicyclePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReturnBicyclePageComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnBicyclePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
