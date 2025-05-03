import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-auth-login',
  standalone: true,
  imports: [],
  templateUrl: './auth-login.component.html',
  styleUrl: './auth-login.component.css'
})
export class AuthLoginComponent implements OnDestroy, OnInit {
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
