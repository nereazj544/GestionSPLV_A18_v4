import { Component, OnInit } from '@angular/core';
import { SupabaseService } from '../../../../shared/service/supabase/data/supabase.service';
import { Route, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ShowService } from '../../../../shared/service/supabase/show.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-reviewssettings',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './reviewssettings.component.html',
  styleUrl: './reviewssettings.component.css'
})
export class ReviewssettingsComponent implements OnInit {

  reviewsForm: FormGroup;

  id = '';
  username = '';
  imagen_perfil = '';
  constructor(
    private supabaseService: SupabaseService,
    private showService: ShowService,
    private formBuilder: FormBuilder
  ) {
    this.reviewsForm = this.formBuilder.group({
      texto: ['', Validators.required],
      autor_id: [this.id],
      tipo: ['', Validators.required],
      puntuacion: ['', Validators.required],
      fechaCreacion: [new Date(), Validators.required],
      horaCreacion: [new Date(), Validators.required],

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

  //Insertar en la base de datos la reseña
  async onSubmit() {
    if (this.reviewsForm.valid) {
      const reviewData = this.reviewsForm.value;
      try{
        const { data, error } = await this.supabaseService.insertReview({
          texto: reviewData.texto,
          autor_id: this.id,
          tipo: reviewData.tipo,
          puntuacion: reviewData.puntuacion,
          fechaCreacion: reviewData.fechaCreacion,
          horaCreacion: reviewData.horaCreacion
        });
      }catch (error) {
        console.error('Error al insertar la reseña:', error);
        alert('Error al insertar la reseña');
      }

    }
  }


  //buscador para el contenido
  buscarContenido(event: any) {
    const query = event.target.value.toLowerCase();
    const contenido = document.querySelectorAll('.contenido');
    contenido.forEach((element: any) => {
      const texto = element.textContent.toLowerCase();
      if (texto.includes(query)) {
        element.style.display = 'block';
      } else {
        element.style.display = 'none';
      }
    });
  }

  


}
