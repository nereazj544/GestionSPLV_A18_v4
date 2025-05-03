import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthSingUpComponent } from './auth-sing-up.component';

describe('AuthSingUpComponent', () => {
  let component: AuthSingUpComponent;
  let fixture: ComponentFixture<AuthSingUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthSingUpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthSingUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
