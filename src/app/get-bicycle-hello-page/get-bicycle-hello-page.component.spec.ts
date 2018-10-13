import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetBicycleHelloPageComponent } from './get-bicycle-hello-page.component';

describe('GetBicycleHelloPageComponent', () => {
  let component: GetBicycleHelloPageComponent;
  let fixture: ComponentFixture<GetBicycleHelloPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetBicycleHelloPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetBicycleHelloPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
