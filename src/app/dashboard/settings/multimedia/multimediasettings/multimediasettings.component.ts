import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-multimediasettings',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './multimediasettings.component.html',
  styleUrl: './multimediasettings.component.css'
})
export class MultimediasettingsComponent {
//  blogForm: FormGroup;
  id = '';
  username = '';
  imagen_perfil = '';
  generosDisponibles = ['Acción', 'Aventura', 'Ciencia Ficción', 'Comedia', 'Drama', 'Fantasía', 'Horror', 'Romance', 'Suspenso'];

formData = {
    title: '',
    mediaType: 'image',
    comments: 'yes',
    created: new Date().toLocaleDateString(),
    urlImg: '',
    content: '',
    generos: [this.generosDisponibles[0]]
  };

  onSubmit() {
    console.log('Form submitted:', this.formData);
  }
}
