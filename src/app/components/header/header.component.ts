import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { SupabaseService } from '../../shared/service/supabase/data/supabase.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule,
    CommonModule,

  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  role: string | null = null;
  isLoggedIn: boolean = false;


  userId: string | null = null;
  username: string | null = null;
  isDropdownOpen = false;


  isLoginPage = false;
  isRegistroPage = false;

  onHomeClick(): void {
    this.isLoginPage = false;
    this.isRegistroPage = false;
  }

  constructor(private router: Router,
    private supabaseService: SupabaseService
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isLoginPage = this.router.url === ('/login');
        this.isRegistroPage = this.router.url === ('/signup');
      }
    })
  }


  onLonginClick(): void {
    console.log("Click en iniciar sesion");
  }
  onRegistroinClick(): void {
    console.log("Click en Registrarse");
  }


  async ngOnInit() {
    await this.supabaseService.cargarUsuario();
    const user = this.supabaseService.getUsuario();
    this.isLoggedIn = !!user;
    if (user) {
      this.role = user.role;
      this.userId = user.username;
      console.log('Usuario cargado:', user);
    } else {
      console.log('No hay usuario cargado');
    }
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;



  }

  async cerrarSesion() {
    try {
      const { success, error } = await this.supabaseService.signOut();
      if (success) {
        this.router.navigate(['/login']);
      } else {
        console.error('Error al cerrar sesión:', error);
      }
    } catch (error) {
      console.error('Error inesperado:', error);
    }
  }


}