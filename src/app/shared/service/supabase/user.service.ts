import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class UserService {
    private _usuarioActual: any = null;

    setUsuario(usuario: any) {
        this._usuarioActual = usuario;
    }

    setUserRole(role: { rol: string }) {
        this._usuarioActual = role;
    }

    getUsuario() {
        return this._usuarioActual;
    }

    getRolUsuario(): string | null {
        return this._usuarioActual?.rol ?? null;
    }
}
