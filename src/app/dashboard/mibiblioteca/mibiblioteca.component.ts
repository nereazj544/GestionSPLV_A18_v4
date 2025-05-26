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
  conTitulo: string | null = null;
  conImagen: string | null = null;
  bibliotecaEstado: string | null = null;
  bibliotecaCalificacion: string | null = null;
  bibliotecaAgregadoEn: string | null = null;
  bibliotecaFinalizadoEn: string | null = null;
  bibliotecaValoracion: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private supabase: SupabaseService,
    private show: ShowService

  ) { }


  async ngOnInit() {
    const { data: { user } } = await this.supabase.supabaseClient.auth.getUser();

    if (user?.id) {
      await this.cargarTodaBibliotecaDelUsuario(user.id);
    } else {
      console.warn('No se pudo obtener el usuario actual');
    }
  }


  async cargarBiblioteca(id: string) {
    const { data, error } = await this.supabase.supabaseClient
      .from('mi_biblioteca')
      .select(`
    *,
   
    contenidos (
      titulo,
      imagen_url,
      tipo
    )
  `)
      .eq('id', id)
      .single();
    if (error) {
      console.error('Error al cargar la biblioteca:', error);
    }
    if (data) {
      const c = data.contenidos;
      const b = data.mi_biblioteca;

      //datos contenidos
      this.conTitulo = c.titulo;
      this.conImagen = c.imagen_url;

      //datos biblioteca
      this.bibliotecaEstado = b.estado;
      this.bibliotecaValoracion = b.valoracion;
      this.bibliotecaCalificacion = b.calificacion;
      this.bibliotecaAgregadoEn = b.agregado_en;
      this.bibliotecaFinalizadoEn = b.finalizado_en;

    }

  }
  contenidos: any[] = [];
  async cargarTodaBibliotecaDelUsuario(usuarioId: string) {
    const { data, error } = await this.supabase.supabaseClient
      .from('mi_biblioteca')
      .select(`
      *,
      contenidos (
          titulo,
          imagen_url,
          tipo
        )
      )
    `)
      .eq('usuario_id', usuarioId)
      ;

    if (error) {
      console.error('Error al cargar toda la biblioteca:', error);
      return;
    }
    this.contenidos = data || [];
  }


  /*
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
        .eq('mi_biblioteca.usuario_id', usuarioId)
        
        ;
  
      if (error) {
        console.error('Error al cargar toda la biblioteca:', error);
        return;
      }
      this.contenidos = data || [];
    }
  */
  // Método auxiliar para filtrar por tipo (pestaña)
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