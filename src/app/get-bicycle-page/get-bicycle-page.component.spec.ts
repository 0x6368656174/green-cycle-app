import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetBicyclePageComponent } from './get-bicycle-page.component';

describe('GetBicyclePageComponent', () => {
  let component: GetBicyclePageComponent;
  let fixture: ComponentFixture<GetBicyclePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetBicyclePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetBicyclePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
