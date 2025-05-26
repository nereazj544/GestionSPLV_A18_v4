import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SupabaseService } from '../../../shared/service/supabase/data/supabase.service';
import { ShowService } from '../../../shared/service/supabase/show.service';

@Component({
  selector: 'app-bibliotecasettings',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './bibliotecasettings.component.html',
  styleUrl: './bibliotecasettings.component.css'
})
export class BibliotecasettingsComponent implements OnInit {
  biblioSettings: FormGroup;
  id = '';
  username = '';
  imagen_perfil = '';
  todosLosContenidos: any[] = [];
  resultadosBusqueda: any[] = [];
  contenidoSeleccionado: any = null;

  constructor(
    private fb: FormBuilder,
    private supabaseService: SupabaseService,
    private showService: ShowService
  ) {
    this.biblioSettings = this.fb.group({
      tipo: ['', Validators.required],
      estado: ['', Validators.required],
      calificacion: [''],
      comentario: [''],
      agregado_fecha: [''],
      agregado_hora: [''],
      finalizado_fecha: [''],
      finalizado_hora: [''],
    });
  }

  async ngOnInit() {
    await this.loadUserProfile();
    this.supabaseService.getAllMultimedia().subscribe({
      next: ({ data }) => {
        this.todosLosContenidos = data || [];
      },
      error: (err) => {
        console.error('Error al cargar los contenidos:', err);
      }
    });
  }

  // Cargar el perfil del usuario, para mostrar su imagen y nombre
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

  // Buscar contenido por título
  buscarContenido(event: Event): void {
    const input = event.target as HTMLInputElement;
    const valor = input?.value || '';
    const termino = valor.toLowerCase();
    const tipo = this.biblioSettings.get('tipo')?.value;
    this.resultadosBusqueda = this.todosLosContenidos.filter(
      contenido => (!tipo || contenido.tipo === tipo) &&
        contenido.titulo.toLowerCase().includes(termino)
    );
    this.contenidoSeleccionado = null;
  }

  seleccionarContenido(contenido: any) {
    this.contenidoSeleccionado = contenido;
    this.resultadosBusqueda = [];
    this.biblioSettings.patchValue({
      tipo: contenido.tipo
    });
  }

  async onSubmit() {
    if (this.biblioSettings.valid && this.contenidoSeleccionado) {
      const bblData = this.biblioSettings.value;

      // Armar fecha-hora en ISO SOLO si ambos existen
      const agregado_en = (bblData.agregado_fecha && bblData.agregado_hora)
        ? new Date(`${bblData.agregado_fecha}T${bblData.agregado_hora}`).toISOString()
        : null;
      const finalizado_en = (bblData.finalizado_fecha && bblData.finalizado_hora)
        ? new Date(`${bblData.finalizado_fecha}T${bblData.finalizado_hora}`).toISOString()
        : null;

      // Si "Pendiente", no mandar calificacion ni fechas
      let insertData: any = {
        usuario_id: this.id,
        tipo: bblData.tipo,
        estado: bblData.estado,
        comentario: bblData.comentario || null,
      };

      if (bblData.estado === 'Completado') {
        insertData.calificacion = bblData.calificacion ? Number(bblData.calificacion) : null;
        insertData.agregado_en = agregado_en;
        insertData.finalizado_en = finalizado_en;
      }

      try {
        const { data, error } = await this.supabaseService.supabaseClient
          .from('mi_biblioteca')
          .insert([insertData])
          .select()
          .single();
        if (error) throw error;

        // Guardar relación con contenido
        const idBiblioteca = data.id;
        const contenido_id = this.contenidoSeleccionado.id;
        await this.supabaseService.supabaseClient
          .from('mi_biblioteca_contenido')
          .insert([{ mi_biblioteca_id: idBiblioteca, contenido_id }]);

        alert('¡Guardado en tu biblioteca!');
        this.biblioSettings.reset();
        this.contenidoSeleccionado = null;
      } catch (error) {
        console.error('Error al insertar la multimedia en la biblioteca:', error);
        alert('Error al insertar la multimedia en la biblioteca. Por favor, inténtalo de nuevo más tarde.');
      }
    }
  }
}
