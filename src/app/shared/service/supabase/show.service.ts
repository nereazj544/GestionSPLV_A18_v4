import { inject, Injectable } from "@angular/core";
import { SupabaseService } from "./data/supabase.service";



@Injectable({ providedIn: 'root' })
export class ShowService {
    private _supabaseClient = inject(SupabaseService).supabaseClient;

    //Obtiene el perfil de usuario por ID
    getUserProfileById(id: string) {
        return this._supabaseClient
            .from('profiles')
            .select('*')
            .eq('id', id)
            .single();
    }

    getBibliotecaById(id: string) {
        return this._supabaseClient
            .from('mi_biblioteca')
            .select('*')
            .eq('usuario_id', id)
            .single();
    }

}
