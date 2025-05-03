import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './user.service';

@Injectable({
    providedIn: 'root'
})
export class ProfileService {
    constructor(
        private router: Router,
        private userService: UserService
    ) { }

    redirectToProfileBasedOnRole() {
        const role = this.userService.getRolUsuario();

        switch (role?.toLowerCase()) {
            case 'admin':
                this.router.navigate(['/perfil/admin']);
                break;
            case 'proveedor':
                this.router.navigate(['/perfil/provider']);
                break;
            case 'user':
                this.router.navigate(['/perfil/user']);
                break;
            default:
                this.router.navigate(['/perfil/default']);
                break;
        }
    }
}