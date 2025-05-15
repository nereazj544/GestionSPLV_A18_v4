import { Component, OnInit } from '@angular/core';
import { ReleasesService } from '../../shared/service/APIs/GoogleBooks/release.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ShowService } from '../../shared/service/supabase/show.service';
import { firstValueFrom } from 'rxjs';
import { SupabaseService } from '../../shared/service/supabase/data/supabase.service';
@Component({
  selector: 'app-novedades',
  standalone: true,
  templateUrl: './novedades.component.html',
  styleUrls: ['./novedades.component.css'],
  imports:[CommonModule, RouterLink]
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

  constructor(private releasesService: ReleasesService,
    private showService: ShowService,
    private supabaseService: SupabaseService
  ) { }

  ngOnInit(): void {
    this.updateReleases();
    this.cargarBlog();
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

  // TODO API - FILTO
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

  //TODO MOSTRAR BLOGS
  blogs:any[] = [];

  async cargarBlog() {
    try {
    const userId = await this.supabaseService.getCurrentUserId();
    if (!userId) {
      throw new Error('Usuario no autenticado');
    }
    
    const blogsObservable = this.supabaseService.getBlogbyIdAutor(userId);
    const result = await firstValueFrom(blogsObservable);
    
    if (result.error) {
      throw result.error;
    }
    
    this.blogs = result.data;
    console.log('Blogs cargados exitosamente:', this.blogs);
  } catch (error) {
    console.error('Error al cargar blogs:', error);
  }
}





}