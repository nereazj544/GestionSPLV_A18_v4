import { Injectable } from "@angular/core";
import{SupabaseClient, createClient} from "@supabase/supabase-js";
import { environment } from "../../../../env/environment.development";
import { from } from "rxjs";
@Injectable({ providedIn: 'root' })
export class SupabaseService {
    supabaseServiceClient: SupabaseClient;
private userActual: any = null;

    constructor() {
        this.supabaseServiceClient = createClient(environment.supabaseUrl, environment.supabaseKey);
        this.cargarUsuario();
    }

    //Cargar el usuario actual
    async cargarUsuario() {
        const { data: { user }, error } = await this.supabaseServiceClient.auth.getUser();
        if (user) {
            const { data, error } = await this.supabaseServiceClient
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
            const { data, error } = await this.supabaseServiceClient
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
        return await this.supabaseServiceClient
            .from('profiles')
            .select('*')
            .eq('username', id)
            .single();
    }

    //Obtiene el perfil de usuario por su ID
    async getCurrentUserId(): Promise<string | null> {
        const { data, error } = await this.supabaseServiceClient.auth.getUser();
        if (error || !data.user) return null;
        return data.user.id;
    }

    //insert blog
    async insertBlog(blogData: any) {
        const { data, error } = await this.supabaseServiceClient
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
        return from(this.supabaseServiceClient
            .from('blogs')
            .select('*')
            .order('creado_en', { ascending: true })
        );
    }

getBlogbyIdAutor(id: string) {
    return from(this.supabaseServiceClient
        .from('blogs')
        .select('*')
        .eq('autor_id', id)
        .order('creado_en', { ascending: true })
    );
}

};