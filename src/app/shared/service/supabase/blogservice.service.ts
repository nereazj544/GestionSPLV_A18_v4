import { Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable({ providedIn: 'root' })
export class BlogService {
    constructor(private supabaseClient: SupabaseClient) {}

    async getBlogWithAuthor(blogId: number) {
        try {
            const { data, error } = await this.supabaseClient
                .from('blogs')
                .select(`
                    *,
                    profiles:autor_id (
                        username,
                        imagen_perfil
                    )
                `)
                .eq('id', blogId)
                .single();

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            return { data: null, error };
        }
    }

    async createBlog(blogData: {
        titulo: string,
        contenido: string,
        tipo: 'duda' | 'blog',
        descripcion?: string,
        permite_comentarios?: boolean
    }, autorId: string) {
        try {
            const { data, error } = await this.supabaseClient
                .from('blogs')
                .insert([{
                    ...blogData,
                    autor_id: autorId
                }])
                .select();

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            return { data: null, error };
        }
    }

    async getComments(blogId: number) {
        try {
            const { data, error } = await this.supabaseClient
                .from('comentarios_blog')
                .select(`
                    *,
                    profiles:autor_id (
                        username,
                        imagen_perfil
                    )
                `)
                .eq('blog_id', blogId)
                .order('creado_en', { ascending: false });

            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            return { data: null, error };
        }
    }
}