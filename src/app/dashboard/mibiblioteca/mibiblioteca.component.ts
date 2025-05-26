import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SupabaseService } from '../../shared/service/supabase/data/supabase.service';
import { ShowService } from '../../shared/service/supabase/show.service';

@Component({
  selector: 'app-mibiblioteca',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './mibiblioteca.component.html',
  styleUrl: './mibiblioteca.component.css'
})
export class MibibliotecaComponent implements OnInit {
  tabs = ['Libros', 'Películas', 'Series', 'Videojuegos'];
  activeTab = this.tabs[0];
  contenidos: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private supabase: SupabaseService,
    private show: ShowService
  ) {}

  async ngOnInit() {
    const userId = await this.supabase.getCurrentUserId();

    if (userId) {
      await this.cargarTodaBibliotecaDelUsuario(userId);
    } else {
      console.warn('No se pudo obtener el usuario actual');
    }
  }

  async cargarTodaBibliotecaDelUsuario(usuarioId: string) {
    const { data, error } = await this.supabase.supabaseClient
      .from('mi_biblioteca_contenido')
      .select(`
        *,
        mi_biblioteca (
          id,
          estado,
          calificacion,
          agregado_en,
          finalizado_en,
          usuario_id
        ),
        contenidos (
          titulo,
          imagen_url,
          tipo
        )
      `)
      .eq('mi_biblioteca.usuario_id', usuarioId); 

    if (error) {
      console.error('Error al cargar toda la biblioteca:', error);
      return;
    }

    this.contenidos = data || [];
  }

  getContenidosPorTipo(tipoTab: string) {
    const map: any = {
      'Libros': 'libro',
      'Películas': 'pelicula',
      'Series': 'serie',
      'Videojuegos': 'videojuego'
    };
    const tipoDb = map[tipoTab] || '';
    return this.contenidos.filter(item => item.contenidos && item.contenidos.tipo === tipoDb);
  }
}
