import { Routes } from '@angular/router';
import { ErrorComponent } from './components/error/error.component';
import { HOMEComponent } from './components/home/home.component';
import { ResComponent } from './components/auth/res/res.component';
import { LoginComponent } from './components/auth/login/login.component';
import { NovedadesComponent } from './components/novedades/novedades.component';

export const routes: Routes = [

    { path: 'home', component: HOMEComponent },
    { path: 'novedades', component: NovedadesComponent },
    { path: 'login', component: LoginComponent },
    { path: 'res', component: ResComponent },
    { path: '**', component: ErrorComponent },

];
