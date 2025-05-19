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

  generosDisponibles = [
    { id: 1, nombre: 'Acción' }, { id: 2, nombre: 'Aventura' },
    { id: 3, nombre: 'Animación' }, { id: 4, nombre: 'Ciencia ficción' },
    { id: 5, nombre: 'Comedia' }, { id: 6, nombre: 'Crimen' },
    { id: 7, nombre: 'Documental' }, { id: 8, nombre: 'Drama' },
    { id: 9, nombre: 'Familia' }, { id: 10, nombre: 'Fantasía' },
    { id: 11, nombre: 'Histórico' }, { id: 12, nombre: 'Horror' },
    { id: 13, nombre: 'Misterio' }, { id: 14, nombre: 'Musical' },
    { id: 15, nombre: 'Romance' }, { id: 16, nombre: 'Suspense' },
    { id: 17, nombre: 'Terror' }, { id: 18, nombre: 'Thriller' },
    { id: 19, nombre: 'Bélico' }, { id: 20, nombre: 'Western' },
    { id: 21, nombre: 'Biografía' }, { id: 22, nombre: 'Deporte' },
    { id: 23, nombre: 'Superhéroes' }, { id: 24, nombre: 'Infantil' },
    { id: 25, nombre: 'Mafia' }
  ];

  tipolibros = [
    { id: 1, nombre: 'Manga' },
    { id: 2, nombre: 'Comic' },
    { id: 3, nombre: 'Novela' },
    { id: 4, nombre: 'Novela ligera' },
    { id: 5, nombre: 'Novela negra' }
  ];

  constructor(
    private fb: FormBuilder,
    private supabaseService: SupabaseService,
    private showService: ShowService
  ) {
    this.multiFrom = this.fb.group({
      titulo: ['', Validators.required],
      autor_obra: ['', Validators.required], // Campo para el autor
      tipo: ['', Validators.required],
      permite_comentarios: [true, Validators.required],
      creado: [new Date().toLocaleDateString()],
      urlImg: [''],
      content: [''],
      generos: [[], Validators.required],
      fechaCreacion: [new Date().toLocaleDateString(), Validators.required],
      horaCreacion: [new Date().toLocaleTimeString(), Validators.required],
      disponibilidad: ['disponible', Validators.required],
      tipolibro: [null], // Usar null como inicial
      comentarios: ['', Validators.required],
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

  onGeneroChange(event: any) {
    const selected = this.multiFrom.value.generos;
    if (selected.length > 5) {
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

    const formValues = this.multiFrom.value;

    const contenidoToInsert: any = {
      tipo: formValues.tipo,
      disponibilidad: formValues.disponibilidad,
      titulo: formValues.titulo,
      descripcion: formValues.content,
      imagen_url: formValues.urlImg,
      proveedor_id: this.id,
      permite_comentarios: formValues.permite_comentarios,
      generos: formValues.generos,
      creado_en: new Date(),
      comentarios: formValues.comentarios,
      autor_obra: formValues.autor_obra // Añade el autor
    };

    if (formValues.tipo === 'libro' && formValues.tipolibro) {
      contenidoToInsert.id_tipolibro = Number(formValues.tipolibro); // El id, no el nombre
    }

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
