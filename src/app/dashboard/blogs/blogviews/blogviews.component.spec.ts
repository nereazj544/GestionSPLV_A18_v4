import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogviewsComponent } from './blogviews.component';

describe('BlogviewsComponent', () => {
  let component: BlogviewsComponent;
  let fixture: ComponentFixture<BlogviewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogviewsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
