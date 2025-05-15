import { Component, inject } from '@angular/core';
import { AuthService } from '../../../auth/data/access/auth.service';
import { async } from 'rxjs';
import { ProfileService } from '../../../shared/service/supabase/profile.service';
import { UserService } from '../../../shared/service/supabase/user.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-default',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './default.component.html',
  styleUrl: './default.component.css'
})
export class DefaultComponent {


  private _authService = inject(AuthService);
  private _userService = inject(UserService);
  private _profileService = inject(ProfileService);
  router: any;


  async accederPerfil() {



    const userId = this._userService.getUsuario().id;
    // Obtener el perfil del usuario desde 'profiles'
    const { data: profileData, error: profileError } = await this._authService.supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('No se pudo obtener el perfil:', profileError);
      return;
    }   
    this._profileService.redirectToProfileBasedOnRole(); // Redirigir según el rol
  }
}
