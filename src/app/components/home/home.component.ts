import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule,
    CommonModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HOMEComponent implements OnDestroy, OnInit {
  imagenes = [
    'https://i.pinimg.com/736x/40/ff/e9/40ffe966a442b3d5712b0178afcc16ad.jpg',
    'https://i.pinimg.com/736x/84/a0/a0/84a0a065c010b68fe81aadd440ee7c64.jpg',
    'https://i.pinimg.com/736x/3c/78/d9/3c78d94682e6acdf4819750061901e12.jpg',
    'https://i.pinimg.com/736x/8f/cc/a0/8fcca0551f79aaecc6d77e7608755a2b.jpg'
  ];

  categorias = ['Libros', 'Videojuegos', 'Series', 'Peliculas']

  currentImg = this.imagenes[0];
  currentCtg = this.categorias[0];

  private imgIn: any;
  private ctgIn: any;
  private curretnImgID = 0;
  private curretnTextID = 0;

  ngOnInit() {
    this.empezar();
  }

  ngOnDestroy() {
    if (this.imgIn) {
      clearInterval(this.imgIn)
    }
    if (this.ctgIn) {
      clearInterval(this.ctgIn)
    }
  }

  private empezar() {
    this.imgIn = setInterval(() => {
      this.curretnImgID = (this.curretnImgID + 1) % this.imagenes.length
      this.currentImg = this.imagenes[this.curretnImgID]
      this.curretnTextID = (this.curretnTextID + 1) % this.categorias.length
      this.currentCtg = this.categorias[this.curretnTextID]
    }, 5000)
  }

}