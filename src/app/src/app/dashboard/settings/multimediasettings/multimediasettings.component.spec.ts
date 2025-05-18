import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultimediasettingsComponent } from './multimediasettings.component';

describe('MultimediasettingsComponent', () => {
  let component: MultimediasettingsComponent;
  let fixture: ComponentFixture<MultimediasettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultimediasettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultimediasettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
