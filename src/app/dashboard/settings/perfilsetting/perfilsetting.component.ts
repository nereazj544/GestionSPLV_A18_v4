import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SupabaseService } from '../../../shared/service/supabase/data/supabase.service';
import { UserService } from '../../../shared/service/supabase/user.service';

@Component({
  selector: 'app-perfilsetting',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './perfilsetting.component.html',
  styleUrl: './perfilsetting.component.css'
})
export class PerfilsettingComponent implements OnInit {
  profileImageUrl: string = '';
  bannerImageUrl: string = '';
  profileForm: FormGroup;
  usuario: any;

  constructor(
    private fb: FormBuilder,
    private supabaseService: SupabaseService,
    private userService: UserService,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      username: ['', [Validators.required]],
      gender: [''],
      presentacion: [''],
      location: [''],
      banner: [''],
      imagen_perfil: ['']
    });
  }

  async ngOnInit() {
    await this.supabaseService.cargarUsuario();
    this.usuario = this.supabaseService.getUsuario();

    this.profileImageUrl = this.usuario?.imagen_perfil || '';
    this.bannerImageUrl = this.usuario?.banner || '';

    this.profileForm = this.fb.group({
      username: [this.usuario?.username || '', Validators.required],
      gender: [this.usuario?.genero || 'no_answer'],
      presentacion: [this.usuario?.presentacion || ''],
      location: [this.usuario?.location || ''],
      banner: [this.usuario?.banner || ''],
      imagen_perfil: [this.usuario?.imagen_perfil || '']
    });
  }

  CoverPhoto() {
    const url = prompt('Introduce la URL de la imagen del banner:');
    if (url) {
      this.bannerImageUrl = url;
      this.profileForm.patchValue({ banner: url });
    }
  }

  ProfilePhoto() {
    const url = prompt('Introduce la URL de la imagen del perfil:');
    if (url) {
      this.profileImageUrl = url;
      this.profileForm.patchValue({ imagen_perfil: url });
    }
  }

  async onSubmit() {
    if (this.profileForm.valid && this.usuario) {
      const profileData = this.profileForm.value;

      try {
        await this.supabaseService.updateUserProfile(this.usuario.id, {
          username: profileData.username,
          genero: profileData.gender,
          presentacion: profileData.presentacion,
          location: profileData.location,
          banner: profileData.banner,
          imagen_perfil: profileData.imagen_perfil
        });

        alert('Perfil actualizado con éxito');

        // Redirigir al perfil del usuario usando su role
        this.router.navigate(['perfil', this.usuario.role]);

      } catch (error) {
        console.error('Error al actualizar perfil:', error);
        alert('Error al actualizar el perfil, falta información: Introduce el nombre de usuario y el género');
      }
    }
  }

  cancelar() {
    const role = this.profileForm.value.role || this.usuario?.role;
    this.router.navigate(['perfil', role]);
  }
}

