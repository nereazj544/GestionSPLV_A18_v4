import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SupabaseService } from '../../shared/service/supabase/data/supabase.service';

@Component({
  selector: 'app-mibiblioteca',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mibiblioteca.component.html',
  styleUrl: './mibiblioteca.component.css'
})
export class MibibliotecaComponent implements OnInit {
  tabs = ['Libros', 'Películas', 'Series', 'Juegos'];
  activeTab = this.tabs[0];
  conTitulo: any;
  conImagen: any;
  bibliotecaEstado: any;
  bibliotecaCalificacion: any;
  bibliotecaAgregadoEn: any;
  bibliotecaFinalizadoEn: any;

  constructor(
    private route: ActivatedRoute,
    private supabase: SupabaseService
  ) { }


  ngOnInit() {
    const bbliId = this.route.snapshot.paramMap.get('id');
    if (bbliId) {
      this.cargarBiblioteca(bbliId);
    }
  }
  
  async cargarBiblioteca(id: string) {
    const {data, error} = await this.supabase.supabaseClient
    .from('mi_biblioteca_contenido')
     .select(`
      *,
      mi_biblioteca (
        id,
        estado, 
        calificacion,
        agregado_en,
        finalizado_en
      ),
      contenidos (
        titulo,
        imagen_url
        
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
      this.bibliotecaCalificacion = b.calificacion;
      this.bibliotecaAgregadoEn = b.agregado_en;
      this.bibliotecaFinalizadoEn = b.finalizado_en;

  }

}
}