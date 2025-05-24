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
  styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent implements OnInit {
  rTitutlo: string | null = null;;
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
  tipo: string | null = null;
  generos: string[] = [];
  tiposLibros: string[] = [];
  plataformas: string[] = [];
  temporadas: string[] = [];
  reviewTexto: string | null = null;
  reviewPuntuacion: number | null = null;

  constructor(
    private supabase: SupabaseService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const multiId = this.route.snapshot.paramMap.get('id');
    if (multiId) {
      this.cargarDetalleMultimedia(multiId);

    }
  }


  async cargarDetalleMultimedia(id: string) {
    const { data, error } = await this.supabase.supabaseClient
      .from('contenido_review')
      .select(`
      *,
      review (
        id,
        titulo,
        texto,
        puntuacion,
        creado,
        profiles (username, imagen_perfil)
      ),
      contenidos (
        titulo,
        descripcion,
        creado_en,
        autor_obra,
        tipo,
        contenido_generos (generos (nombre)),
        contenido_tipo (tipolibro (nombre)),
        contenido_plataformas (plataforma (nombre)),
        contenido_temporada (temporada (numero))
      )
    `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error al obtener multimedia:', error);
      return;
    }

    if (data) {
      const c = data.contenidos;
      const r = data.review;

      // Datos del contenido
      this.contTitle = c?.titulo || null;
      this.tipo = c?.tipo || null;
      this.multContent = c?.descripcion || null;
      
      // Reseña
      this.username = r?.profiles?.username || null;
      this.imagen_perfil = r?.profiles?.imagen_perfil || null;
      this.mlAutor = data.autor_id || null;
      this.rTitutlo = r?.titulo || null;
      this.reviewTexto = r?.texto || null;
      this.reviewPuntuacion = r?.puntuacion || null;
      this.mlTimestamp = r?.creado || null;

      // Relaciones
      this.autor = c?.autor_obra || null;
      this.generos = (c.contenido_generos || []).map((g: any) => g.generos?.nombre).filter(Boolean);
      this.tiposLibros = (c.contenido_tipo || []).map((t: any) => t.tipolibro?.nombre).filter(Boolean);
      this.plataformas = (c.contenido_plataformas || []).map((p: any) => p.plataforma?.nombre).filter(Boolean);
      this.temporadas = (c.contenido_temporada || []).map((t: any) => t.temporada?.numero).filter(Boolean);
    }
  }
}