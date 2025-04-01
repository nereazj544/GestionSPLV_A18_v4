import { Component, OnInit } from '@angular/core';
import { ReleasesService } from '../../service/release.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-novedades',
  standalone: true,
  templateUrl: './novedades.component.html',
  styleUrls: ['./novedades.component.css'],
  imports:[CommonModule]
})
export class NovedadesComponent implements OnInit {
  libros: any[] = [];

  isVideogameFilter: boolean = false;
  filtros = ['Libros', 'Peliculas', 'Series', 'Videojuegos'];
  plataformas = ['TODO', 'PS5', 'XBOX X|S', 'SWITCH', 'PC'];

  searchText: string = '';
  selectedPlatarforma = '';

  currentFilter: string = 'Libros';
  currentReleases: any[] = [];

  constructor(private releasesService: ReleasesService) { }

  ngOnInit(): void {
    this.updateReleases();
  }



  //TODO Cambiar filtro
  async toggleFilter(filtro: string) {
    if (filtro === 'Videojuegos') {
      this.isVideogameFilter = !this.isVideogameFilter;
    }
    this.currentFilter = filtro;
    this.currentFilter = filtro;
    this.selectedPlatarforma = '';
    await this.updateReleases();
  }

  //TODO Filtrar por plataforma
  filtrarPorPlataforma(plataforma: string) {
    console.log('Filtrando por plataforma:', plataforma);
  }

  // Buscar libros al escribir en el input
  async buscar(event: any) {
    this.searchText = event.target.value;
    if (this.searchText.trim()) {
      try {
        if (this.currentFilter === 'Libros') {
          this.currentReleases = await this.releasesService.searchBooks(this.searchText);
        }
        // Aquí puedes añadir más condiciones para otros tipos de búsqueda
      } catch (error) {
        console.error('Error en la búsqueda:', error);
      }
    } else {
      this.updateReleases(); // Volver a la lista normal cuando no hay búsqueda
    }
  }



  private async updateReleases() {
    try {
      this.currentReleases = await this.releasesService.getReleases(
        this.currentFilter,
        this.selectedPlatarforma
      );
    } catch (error) {
      console.error('Error updating releases:', error);
      
    }
  }
}