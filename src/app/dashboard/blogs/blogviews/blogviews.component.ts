import { Component, OnInit } from '@angular/core';
import { SupabaseService } from '../../../shared/service/supabase/data/supabase.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Form, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-blogviews',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './blogviews.component.html',
  styleUrl: './blogviews.component.css'
})
export class BlogviewsComponent implements OnInit {

  blogTitle: string | null = null;
  blogContent: string | null = null;
  username: string | null = null;
  imagen_perfil: string | null = null;
  blogTimestamp: string | null = null;

  comments: any[] = [];
  newComment: string = '';
  blogId!: number;

  comentariosPermitidos: boolean = false;


  constructor(
    private supabase: SupabaseService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const blogId = this.route.snapshot.paramMap.get('id');
    if (blogId) {
      this.supabase.supabaseClient
        .from('blogs')
        .select(`
          *,
          profiles (
            username,
            imagen_perfil
          )
        `)
        .eq('id', blogId)
        .single()
        .then(({ data, error }) => {
          if (error) {
            console.error('Error al obtener el blog:', error);
          } else if (data) {
            this.blogTitle = data.titulo;
            this.blogContent = data.contenido;
            this.blogTimestamp = data.creado_en;
            this.username = data.profiles?.username;
            this.imagen_perfil = data.profiles?.imagen_perfil;

            this.blogId = parseInt(blogId);
            this.cargarComentarios(this.blogId);
            this.comentariosPermitidos = data.permite_comentarios;
          }
        });
    }
  }

  cargarComentarios(blogId: number) {
    this.supabase.supabaseClient
      .from('comentarios_blog')
      .select(`
        *,
        profiles (
          username,
          imagen_perfil
        )
      `)
      .eq('blog_id', blogId)
      .order('creado_en', { ascending: true })
      .then(({ data, error }) => {
        if (error) {
          console.error('Error al obtener comentarios:', error);
        } else {
          this.comments = data.map((c: any) => ({
            author: c.profiles?.username,
            avatar: c.profiles?.imagen_perfil,
            text: c.contenido
          }));
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
      this.cargarComentarios(this.blogId);
    }

  }

}
