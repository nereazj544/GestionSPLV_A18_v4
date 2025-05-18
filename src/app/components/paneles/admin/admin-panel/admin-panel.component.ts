import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SupabaseService } from '../../../../shared/service/supabase/data/supabase.service';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent {

  blogs: any[] = [];
  filteredBlogs: any[] = [];
  selectedFilter: string = 'all';
  comentarios: any[] = [];




  constructor(private supabase: SupabaseService,
    private router: Router) { }



  ngOnInit() {
    this.cargarBlog();
    this.cargarComentarios();
  }

  async cargarBlog() {
    try {
      const { data, error } = await firstValueFrom(this.supabase.getBlogsWithUserInfo());
      if (error) {
        console.error('Error fetching blogs:', error);
        alert('Error fetching blogs');
        return;
      }
      this.blogs = data;
      this.filteredBlogs = this.blogs; // Initialize filteredBlogs with all blogs
      console.log('Blogs fetched successfully:', this.blogs);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      alert('Error fetching blogs');
    }
  }

  onFilter(event: Event) {
    const target = event.target as HTMLSelectElement;
    const filterValue = target.value;
    this.filterBlogs(filterValue);
  }

  filterBlogs(filterValue: string) {
    this.selectedFilter = filterValue;
    if (filterValue === 'all') {
      this.filteredBlogs = this.blogs;
    } else {
      this.filteredBlogs = this.blogs.filter(blog => blog.tipo === filterValue);
    }
  }

async cargarComentarios() {
  try {
    const { data, error } = await this.supabase.supabaseClient
      .from('comentarios_blog')
      .select(`
        id,
        contenido,
        creado_en,
        blog_id,
        profiles (
          username,
          imagen_perfil
        ),
        respuestas_comentarios (
          contenido
        )
      `)
      .order('creado_en', { ascending: false });

    if (error) {
      console.error('Error cargando comentarios:', error);
      return;
    }

    this.comentarios = data.map((c: any) => ({
      id: c.id,
      contenido: c.contenido,
      creado_en: c.creado_en,
      usuario: c.profiles?.username,
      avatar: c.profiles?.imagen_perfil,
      tieneRespuesta: c.respuestas_comentarios?.length > 0,
      respuesta: c.respuestas_comentarios?.[0]?.contenido ?? null
    }));
  } catch (error) {
    console.error('Error cargando comentarios:', error);
  }
}

}
