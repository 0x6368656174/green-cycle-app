import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WayInfoComponent } from './way-info.component';

describe('WayInfoComponent', () => {
  let component: WayInfoComponent;
  let fixture: ComponentFixture<WayInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WayInfoComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WayInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
