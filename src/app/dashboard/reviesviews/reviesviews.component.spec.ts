import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviesviewsComponent } from './reviesviews.component';

describe('ReviesviewsComponent', () => {
  let component: ReviesviewsComponent;
  let fixture: ComponentFixture<ReviesviewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviesviewsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviesviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
