import { Component, OnInit } from '@angular/core';
import { SupabaseService } from '../../../../shared/service/supabase/data/supabase.service';
import { Route, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ShowService } from '../../../../shared/service/supabase/show.service';


@Component({
  selector: 'app-reviewssettings',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './reviewssettings.component.html',
  styleUrl: './reviewssettings.component.css'
})
export class ReviewssettingsComponent implements OnInit {
  id = '';
  username = '';
  imagen_perfil = '';
  constructor(
    private supabaseService: SupabaseService,
    private showService: ShowService,
  ) { }


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
