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

  // Multimedia
  allMultimedia: any[] = [];
  filteredMultimedia: any[] = [];
  searchTerm: string = '';
  tabs = ['Libros', 'Peliculas', 'Series', 'Videojuegos'];
  activeTab = 'Series';

  // Reviews
  allReviews: any[] = [];
  reviews: any[] = [];
  tipoFiltro: string = 'all';

  constructor(private supabaseService: SupabaseService) {}

  ngOnInit(): void {
    this.cargarMultimedia();
    this.cargarReviews();
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
    this.filtrarPorTipoyBusqueda();
  }

  tabToTipo(tab: string): string {
    switch (tab.toLowerCase()) {
      case 'libros': return 'libro';
      case 'peliculas': return 'pelicula';
      case 'series': return 'serie';
      case 'videojuegos': return 'videojuego';
      default: return tab.toLowerCase();
    }
  }

  async cargarMultimedia() {
    try {
      const { data, error } = await firstValueFrom(this.supabaseService.getAllMultimedia());
      if (error) {
        console.error('Error al cargar multimedia:', error);
        return;
      }
      this.allMultimedia = data || [];
      this.filtrarPorTipoyBusqueda();
    } catch (error) {
      console.error('Error al cargar multimedia:', error);
    }
  }

  search(event: Event) {
    this.searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    this.filtrarPorTipoyBusqueda();
  }

  filtrarPorTipoyBusqueda() {
    const tipo = this.tabToTipo(this.activeTab);
    this.filteredMultimedia = this.allMultimedia.filter(item =>
      item.tipo.toLowerCase() === tipo &&
      item.titulo.toLowerCase().includes(this.searchTerm)
    );
  }

  // Reseñas
  async cargarReviews() {
    try {
      const { data, error } = await firstValueFrom(this.supabaseService.getReviewsById());
      if (error) {
        console.error('Error al cargar reviews:', error);
        return;
      }
      this.allReviews = data || [];
      this.aplicarFiltroReviews();
    } catch (error) {
      console.error('Error al cargar reviews:', error);
    }
  }

  filtrarReviews(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.tipoFiltro = selectElement.value;
    this.aplicarFiltroReviews();
  }

  aplicarFiltroReviews() {
    if (this.tipoFiltro === 'all') {
      this.reviews = [...this.allReviews];
    } else {
      this.reviews = this.allReviews.filter(review =>
        review.tipo?.toLowerCase() === this.tipoFiltro
      );
    }
  }
}
