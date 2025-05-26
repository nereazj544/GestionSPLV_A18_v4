import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BibliotecasettingsComponent } from './bibliotecasettings.component';

describe('BibliotecasettingsComponent', () => {
  let component: BibliotecasettingsComponent;
  let fixture: ComponentFixture<BibliotecasettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BibliotecasettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BibliotecasettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
