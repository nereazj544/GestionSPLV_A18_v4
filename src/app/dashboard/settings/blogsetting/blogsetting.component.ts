import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SupabaseService } from '../../../shared/service/supabase/data/supabase.service';
import { ShowService } from '../../../shared/service/supabase/show.service';


@Component({
  selector: 'app-blogsetting',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './blogsetting.component.html',
  styleUrl: './blogsetting.component.css'
})
export class BlogsettingComponent implements OnInit {
  blogForm: FormGroup;
  id = '';
  username = '';
  imagen_perfil = '';

  constructor(
    private fb: FormBuilder,
    private supabaseService: SupabaseService,
    private showService: ShowService
  ) {
    this.blogForm = this.fb.group({
      titulo: ['', Validators.required],
      tipo: ['Blog', Validators.required],
      comentarios: [true, Validators.required],
      descripcion: ['', Validators.required],
      contenido: ['', Validators.required],
      fechaCreacion: ['', Validators.required],
      horaCreacion: ['', Validators.required]
    });
  }

  async ngOnInit() {
    await this.loadUserProfile();
  }

  async loadUserProfile() {
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
  }

  async onSubmit() {
    if (this.blogForm.valid) {
      try {
        const blogData = {
          ...this.blogForm.value,
          tipo: this.blogForm.get('tipo')?.value as 'duda' | 'blog',
          comentarios: this.blogForm.get('comentarios')?.value as boolean,
          autor_id: this.id,
          creado_en: new Date()
        };
        // Aquí iría la lógica para guardar en Supabase
        const { } = await this.supabaseService.insertBlog(blogData);
        console.log('Blog data:', blogData);
        alert('Blog guardado correctamente');
        this.blogForm.reset();
      } catch (error) {
        console.error('Error al guardar blog:', error);
        alert('Error al guardar el blog. Por favor, inténtalo de nuevo.');
      }
    }
  }
}