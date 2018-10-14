import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthCodePageComponent } from './auth-code-page.component';

describe('AuthCodePageComponent', () => {
  let component: AuthCodePageComponent;
  let fixture: ComponentFixture<AuthCodePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AuthCodePageComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthCodePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
