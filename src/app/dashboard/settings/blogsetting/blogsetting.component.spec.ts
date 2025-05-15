import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogsettingComponent } from './blogsetting.component';

describe('BlogsettingComponent', () => {
  let component: BlogsettingComponent;
  let fixture: ComponentFixture<BlogsettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogsettingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogsettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
