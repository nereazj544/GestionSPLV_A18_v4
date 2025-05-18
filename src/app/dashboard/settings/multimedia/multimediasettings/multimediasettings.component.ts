import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { SupabaseService } from '../../../../shared/service/supabase/data/supabase.service';
import { ShowService } from '../../../../shared/service/supabase/show.service';

@Component({
  selector: 'app-multimediasettings',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './multimediasettings.component.html',
  styleUrl: './multimediasettings.component.css'
})
export class MultimediasettingsComponent implements OnInit {
  multiFrom: FormGroup;
  id = '';
  username = '';
  imagen_perfil = '';

  // ID y nombre para futuras integraciones desde BBDD
  generosDisponibles = [
    { id: 1, nombre: 'Acción' },
    { id: 2, nombre: 'Aventura' },
    { id: 3, nombre: 'Ciencia Ficción' },
    { id: 4, nombre: 'Comedia' },
    { id: 5, nombre: 'Drama' },
    { id: 6, nombre: 'Fantasía' },
    { id: 7, nombre: 'Horror' },
    { id: 8, nombre: 'Romance' },
    { id: 9, nombre: 'Suspenso' }
  ];

  constructor(
    private fb: FormBuilder,
    private supabaseService: SupabaseService,
    private showService: ShowService
  ) {
    this.multiFrom = this.fb.group({
      titulo: ['', Validators.required],
      tipo: ['', Validators.required],
      permite_comentarios: [true, Validators.required],
      creado: [new Date().toLocaleDateString()],
      urlImg: [''],
      content: [''],
      generos: [[], Validators.required], // <- Array, no string
      fechaCreacion: [new Date().toLocaleDateString(), Validators.required],
      horaCreacion: [new Date().toLocaleTimeString(), Validators.required],
      disponibilidad: ['disponible', Validators.required],
    });
  }

  async ngOnInit() {
    await this.loadUserProfile();
  }

  async loadUserProfile() {
    const userId = await this.supabaseService.getCurrentUserId();
    if (!userId) {
      console.error('No hay usuario autenticado');
      return;
    }
    this.id = userId;
    const { data, error } = await this.showService.getUserProfileById(this.id);
    if (error) {
      console.error('Error al obtener perfil:', error);
      return;
    }
    this.username = data.username;
    this.imagen_perfil = data.imagen_perfil;
  }

  // Limitador de géneros en selección
  onGeneroChange(event: any) {
    const selected = this.multiFrom.value.generos;
    if (selected.length > 5) {
      // Elimina el último seleccionado
      selected.pop();
      this.multiFrom.get('generos')?.setValue(selected);
      alert('Puedes seleccionar hasta 5 géneros');
    }
  }

  async onSubmit() {
    if (this.multiFrom.invalid) {
      alert('Completa todos los campos obligatorios');
      return;
    }
    // Prepara los datos del formulario
    const formValues = this.multiFrom.value;
    const contenidoToInsert = {
      tipo: formValues.tipo,
      disponibilidad: formValues.disponibilidad,
      titulo: formValues.titulo,
      descripcion: formValues.content,
      imagen_url: formValues.urlImg,
      proveedor_id: this.id,
      permite_comentarios: formValues.permite_comentarios,
      generos: formValues.generos, // Array de IDs de géneros
      creado_en: new Date() // O combínalo con fechaCreacion/horaCreacion si prefieres
    };

    try {
      await this.supabaseService.insertContenido(contenidoToInsert);
      alert('Contenido guardado correctamente');
      this.multiFrom.reset();
    } catch (error) {
      console.error('Error guardando contenido:', error);
      alert('Error guardando el contenido');
    }
  }
}
