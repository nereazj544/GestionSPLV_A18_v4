import { Injectable } from "@angular/core";
import { SupabaseClient, createClient } from "@supabase/supabase-js";
import { environment } from "../../../../env/environment.development";
import { from } from "rxjs";

@Injectable({ providedIn: 'root' })
export class SupabaseService {

    supabaseClient: SupabaseClient;
    private userActual: any = null;

    constructor() {
        this.supabaseClient = createClient(environment.supabaseUrl, environment.supabaseKey);
        this.cargarUsuario();
    }

    //Cargar el usuario actual
    async cargarUsuario() {
        const { data: { user }, error } = await this.supabaseClient.auth.getUser();
        if (user) {
            const { data, error } = await this.supabaseClient
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();
            if (data) {
                this.userActual = data;
                console.log('Usuario cargado:', this.userActual);
            }
        }
    }

    getUsuario() {
        return this.userActual;
    }

    //Actualiza el perfil de usuario
    async updateUserProfile(id: string, profileData: any) {
        try {
            const { data, error } = await this.supabaseClient
                .from('profiles')
                .update(profileData)
                .eq('id', id);
            if (error) {
                console.log('Error al actualizar el perfil:', error);
                throw error;
            }
            console.log('Perfil actualizado:', data);
            return data;
        } catch (error) {
            console.error('Error al actualizar el perfil:', error);
            throw error;
        }
    }


    //Obtiene el perfil de usuario por su ID
    async getUserProfileById(id: string) {
        return await this.supabaseClient
            .from('profiles')
            .select('*')
            .eq('username', id)
            .single();
    }

    //Obtiene el perfil de usuario por su ID
    async getCurrentUserId(): Promise<string | null> {
        const { data, error } = await this.supabaseClient.auth.getUser();
        if (error || !data.user) return null;
        return data.user.id;
    }
    async _getCurrentUserId(): Promise<{ data: { user: any } | null, error: any }> {
        return await this.supabaseClient.auth.getUser();
    }


    //insert blog
    async insertBlog(blogData: any) {
        const { data, error } = await this.supabaseClient
            .from('blogs')
            .insert([{
                autor_id: blogData.autor_id,
                titulo: blogData.titulo,
                contenido: blogData.contenido,
                tipo: blogData.tipo,
                permite_comentarios: blogData.comentarios,
                descripcion: blogData.descripcion,
                creado_en: blogData.creado_en
            }])
            .select();

        if (error) throw error;
        return data;
    }

    // Insertar contenido (libro, película, serie, videojuego)
    async insertContenido(contenidoData: any) {
        // 1. Insertar contenido principal
        const { data, error } = await this.supabaseClient
            .from('contenidos')
            .insert([{
                tipo: contenidoData.tipo,
                disponibilidad: contenidoData.disponibilidad,
                titulo: contenidoData.titulo,
                autor_obra: contenidoData.autor_obra,
                permite_comentarios: contenidoData.permite_comentarios ?? true,
                descripcion: contenidoData.descripcion,
                imagen_url: contenidoData.imagen_url,
                proveedor_id: contenidoData.proveedor_id,
                creado_en: contenidoData.creado_en ?? new Date().toISOString()
            }])
            .select()
            .single();

        if (error) throw error;

        // 2. Insertar géneros asociados (si existen)
        if (contenidoData.generos && Array.isArray(contenidoData.generos)) {
            // data.id será el id del contenido recién creado
            for (const generoId of contenidoData.generos) {
                const { error: generoError } = await this.supabaseClient
                    .from('contenido_generos')
                    .insert([{
                        contenido_id: data.id,
                        genero_id: generoId
                    }]);
                if (generoError) throw generoError;
            }
        }

        // 3. Insertar tipo de libro (si es un libro)
        if (contenidoData.contenido_tipo && contenidoData.tipo === 'libro') {
            for (const contenidoTipoId of contenidoData.contenido_tipo) {
                const { error: tipoError } = await this.supabaseClient
                    .from('contenido_tipo')
                    .insert([{
                        contenido_id: data.id,
                        tipolibro_id: contenidoTipoId,

                    }]);
                if (tipoError) throw tipoError;
            }
        }

        // 4. Insertar plataformas (si existen)
        if (contenidoData.plataformas && Array.isArray(contenidoData.plataformas)) {
            for (const plataformaId of contenidoData.plataforma) {
                const { error: plataformaError } = await this.supabaseClient
                    .from('contenido_plataformas')
                    .insert([{
                        contenido_id: data.id,
                        plataforma_id: plataformaId
                    }]);
                if (plataformaError) throw plataformaError;
            }
        }

        // 5. Insertar temporadas (si existen)
        if (contenidoData.temporadas && Array.isArray(contenidoData.temporadas)) {
            for (const temporadaId of contenidoData.temporada) {
                const { error: temporadaError } = await this.supabaseClient
                    .from('contenido_temporadas')
                    .insert([{
                        contenido_id: data.id,
                        temporada_id: temporadaId
                    }]);
                if (temporadaError) throw temporadaError;
            }
        }

        return data;
    }

    // Obtener todos los blogs
    getBlogs() {
        return from(this.supabaseClient
            .from('blogs')
            .select('*')
            .order('creado_en', { ascending: true })
        );
    }

    // Obtener blogs con información del autor
    getBlogsWithUserInfo() {
        return from(this.supabaseClient
            .from('blogs')
            .select(`
                *,
                profiles (
                    username,
                    imagen_perfil
                )
            `)
            .order('creado_en', { ascending: true })
        );
    }

    // Obtener un blog por su ID
    getBlogbyIdAutor(id: string) {
        return from(this.supabaseClient
            .from('blogs')
            .select('*')
            .eq('autor_id', id)
            .order('creado_en', { ascending: true })
        );
    }

    // TODO: Cerrar sesion
    async signOut() {
        try {
            const { error } = await this.supabaseClient.auth.signOut();
            if (error) throw error;
            return { success: true };
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            return { success: false, error };
        }
    }

    // Insertar un comentario
    async insertComentario(comentarioData: any) {
        const { data, error } = await this.supabaseClient
            .from('comentarios_blogs')
            .insert([comentarioData])
            .select();

        if (error) throw error;
        return data;
    }

    // Obtener comentarios por blog (con info del autor)
    getComentariosPorBlog(blogId: string) {
        return from(this.supabaseClient
            .from('comentarios_blogs')
            .select(`
            *,
            profiles (
                username,
                imagen_perfil
            )
        `)
            .eq('blog_id', blogId)
            .order('creado_en', { ascending: false })
        );
    }

    // Obtener comentarios por blog
    getRespuestasPorComentario(comentarioId: number) {
        return from(this.supabaseClient
            .from('respuestas_comentarios')
            .select(`
      *,
      profiles (
        username,
        imagen_perfil
      )
    `)
            .eq('comentario_id', comentarioId)
            .order('creado_en', { ascending: true }));
    }

    // Insertar una respuesta (desde cuenta admin)
    insertRespuesta(respuesta: any) {
        return from(this.supabaseClient
            .from('respuestas_comentarios')
            .insert([respuesta])
            .select());
    }

    //Mostrar los libros, peliculas, series y videojuegos de la Base de Datos
    getAllMultimedia() {
        return from(this.supabaseClient
            .from('contenidos')
            .select('*')
            .order('creado_en', { ascending: true })
        );
    }


    // Obtener todos los géneros
    getGeneros() {
        return from(this.supabaseClient
            .from('contenido_generos')
            .select('*, generos(nombre)')
            .order('nombre', { ascending: true })
        );
    }

    // Obtener todos los tipos de libros
    getTipos() {
        return from(this.supabaseClient
            .from('contenido_tipo') 
            .select('*, tiposlibros(nombre)')
            .order('nombre', { ascending: true })
        );
    }
}