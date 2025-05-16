import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelProveedorComponent } from './panel-proveedor.component';

describe('PanelProveedorComponent', () => {
  let component: PanelProveedorComponent;
  let fixture: ComponentFixture<PanelProveedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelProveedorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanelProveedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
