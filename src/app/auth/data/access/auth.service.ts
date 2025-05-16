import { inject, Injectable } from "@angular/core";
import { SupabaseService } from "../../../shared/service/supabase/data/supabase.service";
import { SignInWithPasswordCredentials, SignUpWithPasswordCredentials } from "@supabase/supabase-js";




@Injectable({ providedIn: 'root' })
export class AuthService {
    private _supabaseClient = inject(SupabaseService).supabaseClient; 
    signUp(credentials: SignUpWithPasswordCredentials) {
        return this._supabaseClient.auth.signUp(credentials);
    }

    loginIn(credentials: SignInWithPasswordCredentials) {
        return this._supabaseClient.auth.signInWithPassword(credentials); // ¡corregido!
    }

    signOut() {
        return this._supabaseClient.auth.signOut();
    }

    insertProfile(profiles: { id: string; email: string; role: string }) {
        return this._supabaseClient.from('profiles').insert([profiles]);
    }



    get supabase() {
        return this._supabaseClient;
    }
}


/*
sesion() { }

signUp(credentials: SignUpWithPasswordCredentials) {
    this._supabaseClient.auth.signUp(
        credentials
    )
}


loginIn(credentials: SignInWithPasswordCredentials) {
    this._supabaseClient.auth.signUp(
        credentials
    )
}

signOut() {
    return this._supabaseClient.auth.signOut()
}
    */
// };