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

    getBlogs() {
        return from(this.supabaseClient
            .from('blogs')
            .select('*')
            .order('creado_en', { ascending: true })
        );
    }


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
}