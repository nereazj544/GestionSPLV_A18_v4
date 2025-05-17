import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SupabaseService } from '../../../shared/service/supabase/data/supabase.service';
import { ShowService } from '../../../shared/service/supabase/show.service';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  id = '';
  username = '';
  imagen_perfil = '';
  banner = '';
  presentacion = '';
  genero = '';
  location = '';

  blogs: any[] = [];

  isOwnProfile: boolean = false;
  isAdmin: boolean = false;
  currentUser: any = null;



  constructor(
    private showService: ShowService,
    private supabaseService: SupabaseService
  ) { }

  async ngOnInit() {
    this.cargarBlog();
    const userId = await this.supabaseService.getCurrentUserId();
    if (!userId) {
      console.error('No hay usuario autenticado');
      return;
    }
    this.id = userId;
    const { data, error } = await this.showService.getUserProfileById(this.id);
    if (error) {
      console.error('Error al obtener perfil:', error);
      return;
    }
    this.username = data.username;
    this.imagen_perfil = data.imagen_perfil;
    this.banner = data.banner;
    this.presentacion = data.presentacion;
    this.genero = data.genero;
    this.location = data.location;

    
  }
  async cargarBlog() {
    try {
    const userId = await this.supabaseService.getCurrentUserId();
    if (!userId) {
      throw new Error('Usuario no autenticado');
    }
    
    const blogsObservable = this.supabaseService.getBlogbyIdAutor(userId);
    const result = await firstValueFrom(blogsObservable);
    
    if (result.error) {
      throw result.error;
    }
    
    this.blogs = result.data;
    console.log('Blogs cargados exitosamente:', this.blogs);
  } catch (error) {
    console.error('Error al cargar blogs:', error);
  }
}

}

