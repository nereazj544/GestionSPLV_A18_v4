import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogmenuComponent } from './blogmenu.component';

describe('BlogmenuComponent', () => {
  let component: BlogmenuComponent;
  let fixture: ComponentFixture<BlogmenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogmenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogmenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
