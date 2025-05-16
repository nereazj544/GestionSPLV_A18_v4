import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelAddUserComponent } from './panel-add-user.component';

describe('PanelAddUserComponent', () => {
  let component: PanelAddUserComponent;
  let fixture: ComponentFixture<PanelAddUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelAddUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanelAddUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
