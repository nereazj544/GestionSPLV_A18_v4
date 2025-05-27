import { Component, OnInit } from '@angular/core';
import { ReleasesService } from '../../shared/service/APIs/GoogleBooks/release.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ShowService } from '../../shared/service/supabase/show.service';
import { firstValueFrom } from 'rxjs';
import { SupabaseService } from '../../shared/service/supabase/data/supabase.service';
import { Movie } from '../../shared/model/movie.interface';
import { TmdbService } from '../../shared/service/APIs/tmdb/tmdb.service';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';

@Component({
  selector: 'app-novedades',
  standalone: true,
  templateUrl: './novedades.component.html',
  styleUrls: ['./novedades.component.css'],
  imports: [CommonModule, RouterLink, MatPaginatorModule]
})
export class NovedadesComponent implements OnInit {
  role: string | null = null;
  username: string | null = null;

  libros: any[] = [];

  isVideogameFilter: boolean = false;
  filtros = ['Libros', 'Peliculas', 'Series', 'Videojuegos'];
  plataformas = ['TODO', 'PS5', 'XBOX X|S', 'SWITCH', 'PC'];

  searchText: string = '';
  selectedPlatarforma = '';
  filteredBlogs: any[] = [];
  selectedFilter: string = 'all';
  currentFilter: string = 'Libros';
  currentReleases: any[] = [];
  _currentReleases: any = [];

  constructor(private releasesService: ReleasesService,
    private showService: ShowService,
    private supabaseService: SupabaseService,
    private movieService: TmdbService
  ) { }

  ngOnInit(): void {
    this.updateReleases();
    this.cargarBlog(); //Cargar blogs al iniciar
    this.loadMovie();
    this.setupLazyLoading();
    this.loadLatestMovies();
    this.loadLatestSeries();
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
        if (this.currentFilter === 'Peliculas') {
          this._currentReleases = await this.movieService.searchMovies(this.searchText);
        }
      } catch (error) {
        console.error('Error en la búsqueda:', error);
      }
    } else {
      this.updateReleases(); // Volver a la lista normal cuando no hay búsqueda
    }
  }

  //TODO API - PELICULAS & SERIES

  loading = false;
  currentMovies = 1;
  movies: Movie[] = [];
  totalItems = 0;
  isInViewport = false;
  pageSize = 10;
  latestMovies: Movie[] = [];
  latestSeries: any[] = [];
  loadMovie(): void {
    this.loading = true;
    const pageNumber = this.currentMovies + 1;

    this.movieService.getMovies(pageNumber).subscribe({
      next: (response) => {
        this.movies = response.results;
        this.totalItems = response.total_results;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading movies', error);
        this.loading = false;
      },
    });
  }

  setupLazyLoading() {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.isInViewport = true;
        }
      });
    }, options);

    document.querySelectorAll('.movie-card').forEach((card) => {
      observer.observe(card);
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentMovies = event.pageIndex;
    this.loadMovie();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  onScroll() {
    this.loadMovie();
  }
  loadLatestMovies(): void {
    this.loading = true;
    this.movieService.getLatestMovies(this.currentMovies).subscribe({
      next: (response) => {
        this.latestMovies = response.results;
        this.totalItems = response.total_results;

        // this.loading = false;
      },
      error: (error) => {
        console.error('Error loading new movies', error);
        // this.loading = false;
      }
    });
  }

  loadLatestSeries(): void {
    this.movieService.getLatestTvSeries(this.currentMovies).subscribe({
      next: (response) => {
        this.latestSeries = response.results;
      },
      error: (error) => {
        console.error('Error loading new series', error);
      }
    });
  }







  //* =============================================================================

  //TODO API -  LIBROS


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
  blogs: any[] = [];

  async cargarBlog() {
    try {
      const { data, error } = await firstValueFrom(this.supabaseService.getBlogsWithUserInfo());
      if (error) {
        console.error('Error fetching blogs:', error);
        alert('Error fetching blogs');
        return;
      }
      this.blogs = data;
      this.filteredBlogs = this.blogs; // Initialize filteredBlogs with all blogs
      console.log('Blogs fetched successfully:', this.blogs);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      alert('Error fetching blogs');
    }
  }

  //TODO FILTRO DE BLOGS (por tipo: duda o blog)
  onFilter(event: Event) {
    const target = event.target as HTMLSelectElement;
    const filterValue = target.value;
    this.filterBlogs(filterValue);
  }

  filterBlogs(filterValue: string) {
    this.selectedFilter = filterValue;
    if (filterValue === 'all') {
      this.filteredBlogs = this.blogs;
    } else {
      this.filteredBlogs = this.blogs.filter(blog => blog.tipo === filterValue);
    }
  }


}