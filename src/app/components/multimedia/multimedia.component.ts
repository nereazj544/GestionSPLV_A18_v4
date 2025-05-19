import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { SupabaseService } from '../../shared/service/supabase/data/supabase.service';

@Component({
  selector: 'app-multimedia',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './multimedia.component.html',
  styleUrl: './multimedia.component.css'
})
export class MultimediaComponent {
  allMultimedia: any[] = []; //sin filtrar
  filteredMultimedia: any[] = []; //filtrado

  tabs = ['Libros', 'Peliculas', 'Series', 'Videojuegos'];
  activeTab = 'Series';

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  constructor(private supabaseService: SupabaseService,

  ) { }

  ngOnInit(): void {
    this.cargarMultimedia();
  }


  // TODO Mostrar los libros, peliculas, series y videojuegos de la Base de Datos
multimedia: any[] = [];

  async cargarMultimedia() {
    try{

      const { data, error } = await firstValueFrom(this.supabaseService.getAllMultimedia());
      if (error) {
        console.error('Error al cargar multimedia:', error);
        return;
    }
    console.log('Multimedia cargada:', data);
    this.multimedia = data;
  }catch (error) {
    console.error('Error al cargar multimedia:', error);
  }

  }
  
  
  // TODO Buscador de libros, peliculas, series y videojuegos de la Base de Datos

  async search(event: Event) {
    const input = event.target as HTMLInputElement;
    const searchTerm = input.value.toLowerCase();

    if (searchTerm) {
      this.multimedia = this.multimedia.filter(item =>
        item.titulo.toLowerCase().includes(searchTerm)
      );
    } else {
      this.cargarMultimedia();
    }
  }


}
