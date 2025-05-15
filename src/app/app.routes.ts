import { Routes } from '@angular/router';
import { ErrorComponent } from './components/error/error.component';
import { HOMEComponent } from './components/home/home.component';

import { NovedadesComponent } from './components/novedades/novedades.component';
import { AuthLoginComponent } from './auth/auth-login/auth-login.component';
import { AuthSingUpComponent } from './auth/auth-sing-up/auth-sing-up.component';
import { AdminComponent } from './dashboard/perfil/admin/admin.component';
import { UserComponent } from './dashboard/perfil/user/user.component';
import { DefaultComponent } from './dashboard/perfil/default/default.component';
import { ProveedorComponent } from './dashboard/perfil/proveedor/proveedor.component';
import { PerfilsettingComponent } from './dashboard/settings/perfilsetting/perfilsetting.component';
import { BlogsettingComponent } from './dashboard/settings/blogsetting/blogsetting.component';

export const routes: Routes = [
    //{ path: '', component:  },

    // TODO: RUTAS DE LA APLICACION
    { path: 'home', component: HOMEComponent },
    { path: 'novedades', component: NovedadesComponent },

    // TODO: RUTAS DE AUTENTICACION
    { path: 'login', component: AuthLoginComponent },
    { path: 'signup', component: AuthSingUpComponent },
    
    
    //TODO: RUTAS DE PERFILES
    { path: 'perfil/admin', component:  AdminComponent},
    { path: 'perfil/user', component:  UserComponent},
    { path: 'perfil/proveedor', component:  ProveedorComponent},
    { path: 'perfil/default', component:  DefaultComponent}, // default route for authenticated users

    { path: 'settings/perfilsetting', component:  PerfilsettingComponent},
    { path: 'settings/blogsetting', component:  BlogsettingComponent},
    



    // TODO: RUTAS DE ERROR
    { path: '**', component: ErrorComponent },

];
