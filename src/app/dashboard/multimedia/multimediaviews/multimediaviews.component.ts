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
  blogContent: string | null = null;
  username: string | null = null;
  imagen_perfil: string | null = null;
  blogTimestamp: string | null = null;

  comments: any[] = [];
  respuestas: any[] = []; // <-- Aquí se guardarán las respuestas_comentarios
  newComment: string = '';
  replyText: string = '';
  blogId!: number;
  comentariosPermitidos: boolean = false;
  activeReplyId: number | null = null;

  constructor(
    private supabase: SupabaseService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const blogId = this.route.snapshot.paramMap.get('id');
    if (blogId) {
      this.supabase.supabaseClient
        .from('contenidos')
        .select('*, profiles (username, imagen_perfil)')
        .eq('id', blogId)
        .single()
        .then(({ data, error }) => {
          if (error) {
            console.error('Error al obtener el blog:', error);
          } else if (data) {
            this.contTitle = data.titulo;
            this.blogContent = data.contenido;
            this.blogTimestamp = data.creado_en;
            this.username = data.profiles?.username;
            this.imagen_perfil = data.profiles?.imagen_perfil;
            this.blogId = parseInt(blogId);
            this.comentariosPermitidos = data.permite_comentarios;
            this.cargarComentariosYRespuestas(this.blogId);
          }
        });
    }
  }

  // Carga comentarios y respuestas de ambas tablas y las asocia
  async cargarComentariosYRespuestas(blogId: number) {
    // 1. Comentarios principales (y replies internos por padre)
    const { data: comentarios, error: err1 } = await this.supabase.supabaseClient
      .from('comentarios_blog')
      .select('*, profiles (username, imagen_perfil)')
      .eq('blog_id', blogId)
      .order('creado_en', { ascending: true });

    // 2. Respuestas admins (tabla aparte)
    const { data: respuestas, error: err2 } = await this.supabase.supabaseClient
      .from('respuestas_comentarios')
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
      .from('comentarios_blog')
      .insert([
        {
          blog_id: this.blogId,
          autor_id: userId,
          contenido: this.newComment
        }
      ]);
    if (insertError) {
      console.error('Error al insertar comentario:', insertError);
    } else {
      this.newComment = '';
      this.cargarComentariosYRespuestas(this.blogId);
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
    .from('respuestas_comentarios')
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
    this.cargarComentariosYRespuestas(this.blogId);
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
      .from('comentarios_blog')
      .insert([
        {
          blog_id: this.blogId,
          autor_id: userId,
          contenido: this.replyText,
          comentario_padre_id: parentCommentId
        }
      ]);
    if (!insertError) {
      this.replyText = '';
      this.activeReplyId = null;
      this.cargarComentariosYRespuestas(this.blogId);
    } else {
      console.error('Error al insertar respuesta:', insertError);
    }
  }
}
