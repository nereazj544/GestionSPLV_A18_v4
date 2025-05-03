import { Injectable } from "@angular/core";
import{SupabaseClient, createClient} from "@supabase/supabase-js";
import { environment } from "../../../../env/environment.development";

@Injectable({ providedIn: 'root' })
export class SupabaseService {
    supabaseServiceClient: SupabaseClient;

    constructor() {
    this.supabaseServiceClient= createClient(environment.supabaseUrl, environment.supabaseKey);

    }
};