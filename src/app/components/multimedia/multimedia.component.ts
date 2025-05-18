import { Component } from '@angular/core';

@Component({
  selector: 'app-multimedia',
  standalone: true,
  imports: [],
  templateUrl: './multimedia.component.html',
  styleUrl: './multimedia.component.css'
})
export class MultimediaComponent {
tabs = ['Libros', 'Peliculas', 'Series', 'Videojuegos'];
  activeTab = 'Series';

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }
}
