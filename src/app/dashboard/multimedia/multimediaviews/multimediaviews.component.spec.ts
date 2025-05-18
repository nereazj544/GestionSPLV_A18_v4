import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultimediaviewsComponent } from './multimediaviews.component';

describe('MultimediaviewsComponent', () => {
  let component: MultimediaviewsComponent;
  let fixture: ComponentFixture<MultimediaviewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultimediaviewsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultimediaviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
