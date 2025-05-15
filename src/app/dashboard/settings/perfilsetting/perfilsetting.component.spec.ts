import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilsettingComponent } from './perfilsetting.component';

describe('PerfilsettingComponent', () => {
  let component: PerfilsettingComponent;
  let fixture: ComponentFixture<PerfilsettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilsettingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerfilsettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
