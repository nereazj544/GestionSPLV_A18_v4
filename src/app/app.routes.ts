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
import { AdminPanelComponent } from './components/paneles/admin/admin-panel/admin-panel.component';
import { PanelAddUserComponent } from './components/paneles/admin/panel-add-user/panel-add-user.component';
import { PanelProveedorComponent } from './components/paneles/proveedor/panel-proveedor/panel-proveedor.component';
import { BlogviewsComponent } from './dashboard/blogs/blogviews/blogviews.component';


import { MultimediaviewsComponent } from './dashboard/multimedia/multimediaviews/multimediaviews.component';
import { MultimediasettingsComponent } from './dashboard/settings/multimedia/multimediasettings/multimediasettings.component';
import { MultimediaComponent } from './components/multimedia/multimedia.component';
import { MibibliotecaComponent } from './dashboard/mibiblioteca/mibiblioteca.component';

import { ReviewssettingsComponent } from './dashboard/settings/reviessettings/reviewssettings/reviewssettings.component';
import { ReviewsComponent } from './components/paneles/reviews/reviews.component';

export const routes: Routes = [
    //{ path: '', component:  },

    // TODO: RUTAS DE LA APLICACION
    { path: 'home', component: HOMEComponent },
    { path: 'novedades', component: NovedadesComponent },
    { path: 'multimedia', component: MultimediaComponent },
    { path: 'mibiblioteca/:role/:username', component: MibibliotecaComponent },

    // TODO: RUTAS DE AUTENTICACION
    { path: 'login', component: AuthLoginComponent },
    { path: 'signup', component: AuthSingUpComponent },


    //TODO: RUTAS DE PERFILES
    { path: 'perfil/admin', component: AdminComponent },
    { path: 'perfil/user', component: UserComponent },
    { path: 'perfil/proveedor', component: ProveedorComponent },
    { path: 'perfil/default', component: DefaultComponent }, // default route for authenticated users


    // TODO: RUTAS PARA PERFILES USERNAME
    { path: 'perfil/admin/:username', component: AdminComponent },
    { path: 'perfil/user/:username', component: UserComponent },
    { path: 'perfil/proveedor/:username', component: ProveedorComponent },



    // TODO: RUTAS DE SETTINGS
    { path: 'settings/perfilsetting', component: PerfilsettingComponent },
    { path: 'settings/blogsetting', component: BlogsettingComponent },
    { path: 'settings/multimediasettings/multimediasettings', component: MultimediasettingsComponent },
    { path: 'dashboard/settings/reviessettings/reviewssettings', component: ReviewssettingsComponent },

    // TODO: MOSTRAR CONTENIDO 
    { path: 'dashboard/blogs/blogviews/:id', component: BlogviewsComponent },
    { path: 'dashboard/multimedia/multimediaviews/:id', component: MultimediaviewsComponent },

    { path: 'paneles/reviews/reviews/:id', component: ReviewsComponent },

    // TODO: Paneles de desarrollo
    { path: 'components/paneles/admin/admin-panel', component: AdminPanelComponent },
    { path: 'components/paneles/proveedor/panel-proveedor', component: PanelProveedorComponent },
    { path: 'components/paneles/admin/panel-add-user', component: PanelAddUserComponent },






    // TODO: RUTAS DE ERROR
    { path: '**', component: ErrorComponent },

];
