import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-multimediasettings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './multimediasettings.component.html',
  styleUrl: './multimediasettings.component.css'
})
export class MultimediasettingsComponent {
formData = {
    title: '',
    mediaType: 'image',
    comments: 'yes',
    created: new Date().toLocaleDateString(),
    urlImg: '',
    content: ''
  };

  onSubmit() {
    console.log('Form submitted:', this.formData);
  }
}
