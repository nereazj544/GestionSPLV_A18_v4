import { Component, OnInit } from '@angular/core';
import { SupabaseService } from '../../../shared/service/supabase/data/supabase.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-blogviews',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blogviews.component.html',
  styleUrl: './blogviews.component.css'
})
export class BlogviewsComponent implements OnInit {

  blogTitle: string | null = null;
  blogContent: string | null = null;
  username: string | null = null;
  imagen_perfil: string | null = null;
blogTimestamp: string | null = null;

  constructor(private supabase: SupabaseService,
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
          }
        });
    }

  }


}
