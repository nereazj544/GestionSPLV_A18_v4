import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../data/access/auth.service';
import { ProfileService } from '../../shared/service/supabase/profile.service';
import { UserService } from '../../shared/service/supabase/user.service';
import { Router, RouterLink } from '@angular/router';

interface LoginForm {
  email: FormControl<null | string>;
  password: FormControl<null | string>;
}

@Component({
  selector: 'app-auth-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './auth-login.component.html',
  styleUrls: ['./auth-login.component.css']
})
export class AuthLoginComponent implements OnDestroy, OnInit {

  //TODO ===  FORMULARIO ===
  private _formBuilder = inject(FormBuilder);
  private _authServide = inject(AuthService);
  private _profileService = inject(ProfileService);
  private _userService = inject(UserService);

  form = this._formBuilder.group({
    email: this._formBuilder.control(null, [Validators.required, Validators.email]),
    password: this._formBuilder.control(null, [Validators.required]),
    role: this._formBuilder.control('user', [Validators.required]),
  })

  async submit() {
    if (this.form.invalid) return;

    const { email, password } = this.form.value;

    const { data, error } = await this._authServide.loginIn({
      email: email ?? '',
      password: password ?? '',
    });

    if (error || !data.session) {
      console.error('Error al iniciar sesión', error);
      return;
    }

    const userId = data.user.id;

    // Obtener el perfil del usuario desde 'profiles'
    const { data: profileData, error: profileError } = await this._authServide.supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('No se pudo obtener el perfil:', profileError);
      return;
    }

    console.log('Usuario logueado con rol:', profileData.role);
    this._userService.setUserRole({ rol: profileData.role });
    this._profileService.redirectToProfileBasedOnRole(); // Redirigir según el rol
  }


  // TODO ===  IMAGINES & MOSTRAR CONTRASEÑA ===

  // TODO MOSTRAR CONTRASEÑA
  showPass = false;

  togglePass() {
    this.showPass = !this.showPass;
  }


  // TODO IMAGENES
  imagenes = [
    'https://i.pinimg.com/736x/24/1a/33/241a33e322eade5ed3f487b2ac9ea9f5.jpg',
    'https://i.pinimg.com/236x/f8/1b/39/f81b39d7555259c63c23cca0ac0b635e.jpg',
    'https://i.pinimg.com/736x/02/aa/6f/02aa6fc8f112bce0f0fcfd47b8940666.jpg',
    'https://i.pinimg.com/736x/21/e4/ee/21e4eebb78a1febe8e8268a6c24056d8.jpg'
  ];

  currentImgLng = this.imagenes[0];

  private imgIn: any;
  private curretnImgID = 0;


  ngOnInit() {
    this.empezar();
  }

  ngOnDestroy() {
    if (this.imgIn) {
      clearInterval(this.imgIn)
    }
  }

  private empezar() {
    this.imgIn = setInterval(() => {
      this.curretnImgID = (this.curretnImgID + 1) % this.imagenes.length
      this.currentImgLng = this.imagenes[this.curretnImgID]
    }, 5000)
  }
}
