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
    { id: 25, nombre: 'Mafia' }, { id: 26, nombre: 'Dark' },
    { id: 27, nombre: 'Dark Romance' }, { id: 28, nombre: 'Sobrenatural' },
    {id: 29, nombre: 'Futbol' },
    
  ];

  tipolibros = [
    { id: 1, nombre: 'Manga' },
    { id: 2, nombre: 'Comic' },
    { id: 3, nombre: 'Novela' },
    { id: 4, nombre: 'Novela ligera' },
    { id: 5, nombre: 'Novela negra' },
    { id: 6, nombre: 'Manhwa' },
    { id: 7, nombre: 'Manhua' },

  ];

  plataformas = [
    { id: 1, nombre: 'PS4|PS5' },
    { id: 2, nombre: 'Xbox-S|X' },
    { id: 3, nombre: 'Nintendo Switch | 2' },
    { id: 4, nombre: 'PC' },
    { id: 5, nombre: 'Nintendo DS' },
    { id: 6, nombre: 'Nintendo 3DS' }
  ];

  temporadas = [
    { id: 1, numero: '1' },
    { id: 2, numero: '2' },
    { id: 3, numero: '3' },
    { id: 4, numero: '4' },
    { id: 5, numero: '5' },
    { id: 6, numero: '6' },
    { id: 7, numero: '7' },
    { id: 8, numero: '8' },
    { id: 9, numero: '9' },
    { id: 10,numero: '10' },
    {id: 11, numero: '+10'}
  ];

  constructor(
    private fb: FormBuilder,
    private supabaseService: SupabaseService,
    private showService: ShowService
  ) {
    this.multiFrom = this.fb.group({
      titulo: ['', Validators.required],
      tipo: ['', Validators.required],
      disponibilidad: ['disponible', Validators.required],
      imagen_url: ['', Validators.required],
      permite_comentarios: [true, Validators.required],
      generos: [[], Validators.required],
      descripcion: ['', Validators.required],
      contenido_tipo: [[]],
      plataformas: [[]],
      temporadas: [[]],
      autor_obra: ['', Validators.required], // Añade el autor
      tipolibro: [[]], // Añade el tipo de libro
      fechaCreacion: ['', Validators.required],
      horaCreacion: ['', Validators.required]
    });
  }

  async ngOnInit() {
    await this.loadUserProfile(); // Cargar el perfil del usuario
  }

  //Cargar el perfil del usuario, para mostrar su imagen y nombre
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

  //Metodo para solo poder seleccionar 5 generos
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
      descripcion: formValues.descripcion,
      contenido_tipo: formValues.contenido_tipo,
      imagen_url: formValues.imagen_url,
      proveedor_id: this.id,
      permite_comentarios: formValues.permite_comentarios,
      generos: formValues.generos,
      plataformas: formValues.plataformas,
      temporadas: formValues.temporadas,
      creado_en: new Date(),
      comentarios: formValues.comentarios,
      autor_obra: formValues.autor_obra // Añade el autor
    };

    if (formValues.tipo === 'libro' && formValues.contenido_tipo) {
      contenidoToInsert.id_tipolibro = Number(formValues.contenido_tipo); // El id, no el nombre
    }

    try {
      await this.supabaseService.insertContenido(contenidoToInsert);
      console.log('Contenido guardado:', contenidoToInsert);
      alert('Contenido guardado correctamente');
      this.multiFrom.reset();
    } catch (error) {
      console.error('Error guardando contenido:', error);
      alert('Error guardando el contenido');
    }
  }
}
