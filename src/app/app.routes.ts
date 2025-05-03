import { Routes } from '@angular/router';
import { ErrorComponent } from './components/error/error.component';
import { HOMEComponent } from './components/home/home.component';

import { NovedadesComponent } from './components/novedades/novedades.component';
import { AuthLoginComponent } from './auth/auth-login/auth-login.component';
import { AuthSingUpComponent } from './auth/auth-sing-up/auth-sing-up.component';

export const routes: Routes = [

    { path: 'home', component: HOMEComponent },
    { path: 'novedades', component: NovedadesComponent },
    { path: 'login', component: AuthLoginComponent },
    { path: 'signup', component: AuthSingUpComponent },
    

    { path: '**', component: ErrorComponent },

];
