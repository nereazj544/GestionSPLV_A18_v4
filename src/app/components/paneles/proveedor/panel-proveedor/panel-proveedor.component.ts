import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-panel-proveedor',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './panel-proveedor.component.html',
  styleUrl: './panel-proveedor.component.css'
})
export class PanelProveedorComponent {

}
