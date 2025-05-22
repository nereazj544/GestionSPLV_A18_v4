import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewssettingsComponent } from './reviewssettings.component';

describe('ReviewssettingsComponent', () => {
  let component: ReviewssettingsComponent;
  let fixture: ComponentFixture<ReviewssettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewssettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewssettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
