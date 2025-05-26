import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-mibiblioteca',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mibiblioteca.component.html',
  styleUrl: './mibiblioteca.component.css'
})
export class MibibliotecaComponent {
tabs =['Libros', 'Películas', 'Series', 'Juegos'];
activeTab = this.tabs[0];
}
