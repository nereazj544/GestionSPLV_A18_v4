import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SupabaseService } from '../../../shared/service/supabase/data/supabase.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-multimediaviews',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.css'
})
export class ReviewsComponent implements OnInit {
  contTitle: string | null = null;
  multContent: string | null = null;
  username: string | null = null;
  imagen_perfil: string | null = null;
  mlTimestamp: string | null = null;
  mlAutor: string | null = null;
  autor: string | null = null;

  newComment: string = '';
  replyText: string = '';
  mtId!: number;
  comentariosPermitidos: boolean = false;
  activeReplyId: number | null = null;

  // Variables para el detalle del multimedia
  tipo: string | null = null;
  generos: string[] = [];
  tiposLibros: string[] = []; // solo para libros
  plataformas: string[] = []; // solo para videojuegos
  temporadas: string[] = []; // solo para series

  constructor(
    private supabase: SupabaseService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const multiId = this.route.snapshot.paramMap.get('id');
    if (multiId) {
      this.supabase.supabaseClient
        .from('review')
        .select('*, profiles (username, imagen_perfil), contenidos (titulo, descripcion, creado_en, autor_obra, permite_comentarios, profiles (username, imagen_perfil))')

        .single()
        .then(({ data, error }) => {
          if (error) {
            console.error('Error al obtener el blog:', error);
          } else if (data) {
            this.contTitle = data.titulo;
            this.mlAutor = data.autor_id;
            this.autor = data.autor_obra;
            this.multContent = data.descripcion;
            this.mlTimestamp = data.creado_en;
            this.username = data.profiles?.username;
            this.imagen_perfil = data.profiles?.imagen_perfil;



          }
        });
    }

    if (multiId) {
      this.cargarDetalleMultimedia(multiId);
    }
  }


  async cargarDetalleMultimedia(id: string) {
    // Traer todo lo necesario con subselects y relaciones
    const { data, error } = await this.supabase.supabaseClient
      .from('contenido_review')
      .select(`
        *, contenidos: (autor_obra)
          
        
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error al obtener multimedia:', error);
      return;
    }






    // this.autor = data.autor_obra;

    // this.tipo = data.tipo;
    // this.generos = (data.contenido_generos || []).map((g: any) => g.generos?.nombre);
    // this.tiposLibros = (data.contenido_tipo || []).map((t: any) => t.tipolibro?.nombre);
    // this.plataformas = (data.contenido_plataformas || []).map((p: any) => p.plataforma?.nombre);
    // this.temporadas = (data.contenido_temporada || []).map((t: any) => t.temporada?.numero);
  }









}
