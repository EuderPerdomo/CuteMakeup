import { Routes } from '@angular/router';
import { InicioComponent } from './components/inicio/inicio.component';
import { LoginComponent } from './components/login/login.component';
import { adminGuard } from './guards/admin.guard';
import { IndexClienteComponent } from './components/clientes/index-cliente/index-cliente.component';
import { CreateClienteComponent } from './components/clientes/create-cliente/create-cliente.component';
import { EditClienteComponent } from './components/clientes/edit-cliente/edit-cliente.component';
import { IndexProductoComponent } from './components/productos/index-producto/index-producto.component';
import { CreateProductoComponent } from './components/productos/create-producto/create-producto.component';
import { EditProductoComponent } from './components/productos/edit-producto/edit-producto.component';
import { VariedadProductoComponent } from './components/productos/variedad-producto/variedad-producto.component';
import { GaleriaProductoComponent } from './components/productos/galeria-producto/galeria-producto.component';

export const routes: Routes = [
  {
    path: '',
    component: InicioComponent,
    canActivate: [adminGuard],
    data: { allowedRoles: ['user', 'admin'] }  // Definiendo roles permitidos
  },

  //{path:'',redirectTo:'',pathMatch:'full'},

  { path: 'login', component: LoginComponent },

  {
    path: 'panel', children: [
      {
        path: 'clientes',
        component: IndexClienteComponent,
        canActivate: [adminGuard],
        data: { allowedRoles: ['user', 'admin'] }
      },
      {
        path: 'clientes/create',
        component: CreateClienteComponent,
        canActivate: [adminGuard],
        data: { allowedRoles: ['user', 'admin'] }
      },
      {
        path: 'clientes/editar/:id',
        component: EditClienteComponent,
        canActivate: [adminGuard],
        data: { allowedRoles: ['user', 'admin'] }
      },


      //Inician Rutas de Productos
      {
        path:'productos',
        component:IndexProductoComponent,
        canActivate:[adminGuard],
        data:{allowedRoles:['admin']}
      },
      {
        path: 'productos/create',
        component: CreateProductoComponent,
        canActivate: [adminGuard],
        data: { allowedRoles: ['user', 'admin'] }
      },

      {
        path: 'productos/edit/:id',
        component: EditProductoComponent,
        canActivate: [adminGuard],
        data: { allowedRoles: ['user', 'admin'] }
      },
      //Finalizan rutas de Productos

      //Inician rutas Variedades
      
      {
        path: 'productos/variedades/:id',
        component: VariedadProductoComponent,
        canActivate: [adminGuard],
        data: { allowedRoles: ['user', 'admin'] }
      },

      {
        path: 'productos/galeria/:id',
        component: GaleriaProductoComponent,
        canActivate: [adminGuard],
        data: { allowedRoles: ['user', 'admin'] }
      },
      //Finalizan Rutas Variedades
    ]
  },

  //Ruta comodin Para cuando no encuentre ninguna ruta coincidente

  {
    path: '**',
    redirectTo: ''
  }

];
