import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';

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
  isLoginPage = false;
  isRegistroPage = false;

  onHomeClick(): void {
    this.isLoginPage = false;
    this.isRegistroPage = false;
  }

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isLoginPage = this.router.url === ('/login');
        this.isRegistroPage = this.router.url === ('/res');
      }
    })
  }


  onLonginClick(): void {
    console.log("Click en iniciar sesion");
  }
  onRegistroinClick(): void {
    console.log("Click en Registrarse");
  }

}