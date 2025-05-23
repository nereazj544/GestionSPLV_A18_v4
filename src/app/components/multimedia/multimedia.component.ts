import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { SupabaseService } from '../../shared/service/supabase/data/supabase.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-multimedia',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './multimedia.component.html',
  styleUrl: './multimedia.component.css'
})
export class MultimediaComponent {
  allMultimedia: any[] = []; //sin filtrar
  filteredMultimedia: any[] = []; //filtrado

  currentFilter: string = 'Libros';
  currentReleases: any[] = [];

  tabs = ['Libros', 'Peliculas', 'Series', 'Videojuegos'];
  activeTab = 'Series';

  setActiveTab(tab: string) {
    this.activeTab = tab;
    this.filtrarPorTipoyBusqueda();
  }

  constructor(private supabaseService: SupabaseService,

  ) { }

  ngOnInit(): void {
    this.cargarMultimedia();
  }


  // TODO Mostrar los libros, peliculas, series y videojuegos de la Base de Datos
multimedia: any[] = [];

  async cargarMultimedia() {
    try {
      const { data, error } = await firstValueFrom(this.supabaseService.getAllMultimedia());
      if (error) {
        console.error('Error al cargar multimedia:', error);
        return;
      }
      this.allMultimedia = data;
      this.filtrarPorTipoyBusqueda();
    } catch (error) {
      console.error('Error al cargar multimedia:', error);
    }
  }

  searchTerm: string = '';

  // Se ejecuta cuando el input cambia
  search(event: Event) {
    this.searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    this.filtrarPorTipoyBusqueda();
  }

  // Filtro combinado
  async filtrarPorTipoyBusqueda() {
    this.filteredMultimedia = this.allMultimedia.filter(item =>
      item.tipo.toLowerCase() === this.activeTab.toLowerCase().slice(0, -1) && // "Libros" → "libro"
      item.titulo.toLowerCase().includes(this.searchTerm)
    );
  }

  //Mostar las Reviews
  reviews: any[] = [];


  filtrarReviews(event: Event) {
   
  }

}
