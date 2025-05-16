import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { SupabaseService } from '../../../../shared/service/supabase/data/supabase.service';
@Component({
  selector: 'app-panel-add-user',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './panel-add-user.component.html',
  styleUrl: './panel-add-user.component.css'
})
export class PanelAddUserComponent {
 nuevoUsuario = {
    username: '',
    email: '',
    password: '',
    role: ''
  };

  constructor(private supabaseService: SupabaseService) {}

  async crearUsuario() {
    try {
      // Primero crear el usuario en Auth
      const { data: authData, error: authError } = await this.supabaseService.supabaseClient.auth.signUp({
        email: this.nuevoUsuario.email,
        password: this.nuevoUsuario.password
      });

      if (authError) {
        console.error('Error al crear el usuario:', authError);
        return;
      }

      const userId = authData.user?.id;
      if (!userId) return;

      // Luego crear el perfil
      const { error: profileError } = await this.supabaseService.supabaseClient
        .from('profiles')
        .insert({
          id: userId,
          username: this.nuevoUsuario.username,
          email: this.nuevoUsuario.email,
          role: this.nuevoUsuario.role
        });

      if (profileError) {
        console.error('Error al crear el perfil:', profileError);
        return;
      }

      console.log('Usuario creado exitosamente');
      this.nuevoUsuario = { username: '', email: '', password: '', role: '' };
    } catch (error) {
      console.error('Error inesperado:', error);
    }
  }
}
