import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { SupabaseService } from '../../shared/service/supabase/data/supabase.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-multimedia',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './multimedia.component.html',
  styleUrl: './multimedia.component.css'
})
export class MultimediaComponent {
  multiFrom: FormGroup;
  allMultimedia: any[] = []; //sin filtrar
  filteredMultimedia: any[] = []; //filtrado

  tipos_libros=[
    {id: 1, nombre: 'Novela'},
    {id: 2, nombre: 'Manga'},
    {id: 3, nombre: 'Comic'},
    {id: 4, nombre: 'Novela Ligera'},
    {id: 5, nombre: 'Novela Negra'},
  ]


  tabs = ['Libros', 'Peliculas', 'Series', 'Videojuegos'];
  activeTab = 'Series';

  setActiveTab(tab: string) {
    this.activeTab = tab;
    this.filtrarPorTipoyBusqueda();
  }

  constructor(private supabaseService: SupabaseService,
              private fb: FormBuilder
  ) {
    this.multiFrom = this.fb.group({
      titulo: ['', Validators.required],
      tipo: ['', Validators.required],
      tipo_libro: [''],             // SIEMPRE definir aunque esté oculto a veces
      generos: [[], Validators.required],
      comentarios: ['', Validators.required],
      fechaCreacion: ['', Validators.required],
      horaCreacion: ['', Validators.required],
      urlImg: [''],
      content: ['']
    });
  }

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

}
