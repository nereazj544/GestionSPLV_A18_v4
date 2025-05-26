import { Component, OnInit } from '@angular/core';
import { SupabaseService } from '../../../../shared/service/supabase/data/supabase.service';
import { ShowService } from '../../../../shared/service/supabase/show.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-reviewssettings',
  standalone: true,
  imports: [CommonModule,  ReactiveFormsModule],
  templateUrl: './reviewssettings.component.html',
  styleUrl: './reviewssettings.component.css'
})
export class ReviewssettingsComponent implements OnInit {

  reviewsForm: FormGroup;

  id = '';
  username = '';
  imagen_perfil = '';

  todosLosContenidos: any[] = [];
  resultadosBusqueda: any[] = [];
  contenidoSeleccionado: any = null;

  constructor(
    private supabaseService: SupabaseService,
    private showService: ShowService,
    private formBuilder: FormBuilder
  ) {
    this.reviewsForm = this.formBuilder.group({
      texto: ['', Validators.required],
      autor_id: [''],
      titulo: [''],
      tipo: ['', Validators.required],
      puntuacion: ['', Validators.required],
      fechaCreacion: [new Date(), Validators.required],
      horaCreacion: [new Date(), Validators.required],
      multimedia:['']
    });
  }

  async ngOnInit() {
    await this.loadUserProfile();
    await this.loadContenidos();
  }

  // Cargar perfil del usuario
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

  // Cargar todo el contenido multimedia
  async loadContenidos() {
    const {data, error} = await firstValueFrom(this.supabaseService.getAllMultimedia());
    if (error) {
      console.error('Error al obtener contenidos:', error);
      return;
    }
    this.todosLosContenidos = data;
  }

  // Buscar contenido por título
  // Corregida: recibe el evento y extrae el valor
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

    this.reviewsForm.patchValue({
      tipo: contenido.tipo,
      // titulo: contenido.titulo
    });
  }

  // Insertar la reseña
  async onSubmit() {
    if (this.reviewsForm.valid && this.contenidoSeleccionado) {
      const reviewData = this.reviewsForm.value;

      try {
        const { data, error } = await this.supabaseService.insertReview({
          texto: reviewData.texto,
          autor_id: this.id,
          titulo: this.contenidoSeleccionado.titulo,
          tipo: this.contenidoSeleccionado.tipo,
          puntuacion: reviewData.puntuacion,
          fechaCreacion: reviewData.fechaCreacion,
          horaCreacion: reviewData.horaCreacion,
          contenido_review: [this.contenidoSeleccionado.id] // Asociar reseña al contenido
        });

        if (error) {
          throw error;
        }

        alert('Reseña insertada correctamente');
        this.reviewsForm.reset();
        this.contenidoSeleccionado = null;
      } catch (error) {
        console.error('Error al insertar la reseña:', error);
        alert('Error al insertar la reseña');
      }

    } else {
      alert('Formulario inválido o no se ha seleccionado un contenido');
    }
  }

}
