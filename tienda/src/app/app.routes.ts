import { Routes } from '@angular/router';
import { InicioComponent } from './components/inicio/inicio.component';
import { LoginComponent } from './components/login/login.component';
import { CuentaComponent } from './components/perfil/cuenta/cuenta.component';
import { ContactoComponent } from './components/contacto/contacto.component';
import { IndexProductoComponent } from './components/productos/index-producto/index-producto.component';

export const routes: Routes = [
  {
    path: '',
    component: InicioComponent,
    //canActivate: [adminGuard],
    //data: { allowedRoles: ['user', 'admin']}  // Definiendo roles permitidos
  },

  //{path:'',redirectTo:'',pathMatch:'full'},

  { path: 'login', component:LoginComponent },
  { path: 'perfil/cuenta', component:CuentaComponent },
  { path: 'contactenos', component:ContactoComponent },

  { path: 'productos', component:IndexProductoComponent },

  //Ruta comodin Para cuando no encuentre ninguna ruta coincidente

  {
    path: '**',
    redirectTo: ''
  }

];
