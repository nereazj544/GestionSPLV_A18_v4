import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SupabaseService } from '../../../shared/service/supabase/data/supabase.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-multimediaviews',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './multimediaviews.component.html',
  styleUrl: './multimediaviews.component.css'
})
export class MultimediaviewsComponent implements OnInit {
  contTitle: string | null = null;
  multContent: string | null = null;
  username: string | null = null;
  imagen_perfil: string | null = null;
  mlTimestamp: string | null = null;
  mlAutor: string | null = null;
  imagen: string | null = null;
  dispo: boolean = false;
  comments: any[] = [];
  respuestas: any[] = []; // <-- Aquí se guardarán las respuestas_comentarios
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
        .from('contenidos')
        .select('*, profiles (username, imagen_perfil)')
        .eq('id', multiId)
        .single()
        .then(({ data, error }) => {
          if (error) {
            console.error('Error al obtener el blog:', error);
          } else if (data) {
            this.contTitle = data.titulo;
            this.imagen = data.imagen_url;
            this.mlAutor = data.autor_obra;
            this.dispo = data.disponibilidad;
            this.multContent = data.descripcion;
            this.mlTimestamp = data.creado_en;
            this.username = data.profiles?.username;
            this.imagen_perfil = data.profiles?.imagen_perfil;
            this.mtId = parseInt(multiId);
            this.comentariosPermitidos = data.permite_comentarios;
            this.cargarComentariosYRespuestas(this.mtId);
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
      .from('contenidos')
      .select(`
        *,
        profiles(username, imagen_perfil),
        contenido_generos(generos(nombre)),
        contenido_tipo(tipolibro(nombre)),
        contenido_plataformas(plataforma(nombre)),
        contenido_temporada(temporada(numero))
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error al obtener multimedia:', error);
      return;
    }

    this.contTitle = data.titulo;
    this.multContent = data.descripcion;
    this.mlTimestamp = data.creado_en;
    this.username = data.profiles?.username;
    this.imagen_perfil = data.profiles?.imagen_perfil;
    this.imagen = data.imagen_url;
    this.mlAutor = data.autor_obra;
    this.dispo = data.disponibilidad;
    this.tipo = data.tipo;
    this.generos = (data.contenido_generos || []).map((g: any) => g.generos?.nombre);
    this.tiposLibros = (data.contenido_tipo || []).map((t: any) => t.tipolibro?.nombre);
    this.plataformas = (data.contenido_plataformas || []).map((p: any) => p.plataforma?.nombre);
    this.temporadas = (data.contenido_temporada || []).map((t: any) => t.temporada?.numero);
  }



  // TODO: COMENTARIOS
  // Carga comentarios y respuestas de ambas tablas y las asocia
  async cargarComentariosYRespuestas(blogId: number) {
    // 1. Comentarios principales (y replies internos por padre)
    const { data: comentarios, error: err1 } = await this.supabase.supabaseClient
      .from('comentarios_multimedia')
      .select('*, profiles (username, imagen_perfil)')
      .eq('contenido_id', blogId)
      .order('creado_en', { ascending: true });

    // 2. Respuestas admins (tabla aparte)
    const { data: respuestas, error: err2 } = await this.supabase.supabaseClient
      .from('rc_multimedia')
      .select('*, profiles (username, imagen_perfil, role)')
      .order('creado_en', { ascending: true });

    if (err1) { console.error(err1); return; }
    if (err2) { console.error(err2); return; }

    // Ordena comentarios como árbol y añade espacio para respuestas externas
    const commentsMap: { [key: number]: any } = {};
    this.comments = [];
    if (comentarios) {
      comentarios.forEach((c: any) => {
        commentsMap[c.id] = {
          id: c.id,
          author: c.profiles?.username || 'Anónimo',
          avatar: c.profiles?.imagen_perfil,
          text: c.contenido,
          parentId: c.comentario_padre_id,
          replies: [],
          respuestas: [] // <-- aquí irán las respuestas de admin
        };
      });
      // replies internos entre comentarios_blog por comentario_padre_id
      comentarios.forEach((c: any) => {
        if (c.comentario_padre_id && commentsMap[c.comentario_padre_id]) {
          commentsMap[c.comentario_padre_id].replies.push(commentsMap[c.id]);
        } else {
          this.comments.push(commentsMap[c.id]);
        }
      });
    }

    // Asocia respuestas_comentarios a su comentario
    this.respuestas = respuestas || [];
    this.respuestas.forEach((respuesta) => {
      const padre = this.comments.find(c => c.id === respuesta.comentario_id);
      if (padre) {
        padre.respuestas.push(respuesta);
      }
    });
  }

  async addComment() {
    if (!this.newComment.trim()) return;
    const { data, error } = await this.supabase.supabaseClient.auth.getUser();
    if (error || !data?.user) {
      alert("Debes iniciar sesión para comentar.");
      return;
    }
    const userId = data.user.id;
    const { error: insertError } = await this.supabase.supabaseClient
      .from('comentarios_multimedia')
      .insert([
        {
          contenido_id: this.mtId,
          autor_id: userId,
          contenido: this.newComment
        }
      ]);
    if (insertError) {
      console.error('Error al insertar comentario:', insertError);
    } else {
      this.newComment = '';
      this.cargarComentariosYRespuestas(this.mtId);
    }
  }

  async addRespuestaComentario(comentarioId: number, contenidoRespuesta: string) {
    if (!contenidoRespuesta.trim()) return; // No permitir respuestas vacías

    // Obtener el usuario actual (admin)
    const { data, error } = await this.supabase.supabaseClient.auth.getUser();
    if (error || !data?.user) {
      alert("Debes iniciar sesión como administrador para responder.");
      return;
    }
    const adminId = data.user.id;

    // Insertar la respuesta en la tabla respuestas_comentarios
    const { error: insertError } = await this.supabase.supabaseClient
      .from('rc_multimedia')
      .insert([
        {
          comentario_id: comentarioId,
          admin_id: adminId,

          contenido: contenidoRespuesta
          // creado_en se añade por defecto
        }
      ]);

    if (insertError) {
      console.error('Error al insertar la respuesta:', insertError);
    } else {
      this.cargarComentariosYRespuestas(this.mtId);
    }
  }

  toggleReply(commentId: number) {
    this.activeReplyId = this.activeReplyId === commentId ? null : commentId;
    this.replyText = '';
  }

  async sendReply(parentCommentId: number) {
    if (!this.replyText.trim()) return;
    const { data, error } = await this.supabase.supabaseClient.auth.getUser();
    if (error || !data?.user) {
      alert("Debes iniciar sesión para responder.");
      return;
    }
    const userId = data.user.id;
    const { error: insertError } = await this.supabase.supabaseClient
      .from('rc_multimedia')
      .insert([
        {
          contenido_id: this.mtId,
          admin_id: userId,
          contenido: this.replyText,
          comentario_padre_id: parentCommentId
        }
      ]);
    if (!insertError) {
      this.replyText = '';
      this.activeReplyId = null;
      this.cargarComentariosYRespuestas(this.mtId);
    } else {
      console.error('Error al insertar respuesta:', insertError);
    }
  }
}
