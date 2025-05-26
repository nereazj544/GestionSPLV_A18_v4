import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SupabaseService } from '../../../shared/service/supabase/data/supabase.service';
import { ShowService } from '../../../shared/service/supabase/show.service';

@Component({
  selector: 'app-bibliotecasettings',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './bibliotecasettings.component.html',
  styleUrl: './bibliotecasettings.component.css'
})
export class BibliotecasettingsComponent implements OnInit {
biblioSettings: FormGroup;


  id = '';
  username = '';
  imagen_perfil = '';

  todosLosContenidos: any[] = [];
  resultadosBusqueda: any[] = [];
  contenidoSeleccionado: any = null;

  constructor(
    private fb: FormBuilder,
    private supabaseService: SupabaseService,
    private showService: ShowService
  ) {
    this.biblioSettings = this.fb.group({
      tipo: ['', Validators.required],
      estado: [''],
      calificacon: [''],
      comentario: [''],
      agregado: [new Date(), Validators.required],
      finalizado: [new Date(), Validators.required],
    });
  }

  async ngOnInit() {
    await this.loadUserProfile(); // Cargar el perfil del usuario
  }

  //Cargar el perfil del usuario, para mostrar su imagen y nombre
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

  // Buscar contenido por título
  
  buscarContenido(event: Event): void {
    const input = event.target as HTMLInputElement;
    const valor = input?.value || '';

    const termino = valor.toLowerCase();
    this.resultadosBusqueda = this.todosLosContenidos.filter(contenido =>
      contenido.titulo.toLowerCase().includes(termino)
    );
  }



  // Seleccionar contenido de la lista
  seleccionarContenido(contenido: any) {
    this.contenidoSeleccionado = contenido;
    this.resultadosBusqueda = [];

    this.biblioSettings.patchValue({
      tipo: contenido.tipo,
      // titulo: contenido.titulo
    });
  }



}
