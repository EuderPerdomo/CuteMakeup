import { Routes } from '@angular/router';
import { InicioComponent } from './components/inicio/inicio.component';
import { LoginComponent } from './components/login/login.component';
import { ContactoComponent } from './components/contacto/contacto.component';
import { IndexProductoComponent } from './components/productos/index-producto/index-producto.component';
import { ShowProductoComponent } from './components/productos/show-producto/show-producto.component';
import { CarritoComponent } from './components/carrito/carrito.component';
import { AuthGuard } from './guards/auth.guard';
import { DireccionesComponent } from './components/usuario/direcciones/direcciones.component';
import { PerfilComponent } from './components/usuario/perfil/perfil.component';
import { BlogListComponent } from './components/blog/blog-list/blog-list.component';
import { SingleBlogComponent } from './components/blog/single-blog/single-blog.component';

export const routes: Routes = [
  {
    path: '',
    component: InicioComponent,
    //canActivate: [adminGuard],
    //data: { allowedRoles: ['user', 'admin']}  // Definiendo roles permitidos
  },

  //{path:'',redirectTo:'',pathMatch:'full'},

  { path: 'login', component:LoginComponent },
  { path: 'contactenos', component:ContactoComponent },

  { path: 'productos', component:IndexProductoComponent },
  { path: 'productos/categoria/:categoria', component:IndexProductoComponent },
  { path: 'productos/:slug', component:ShowProductoComponent },

//Ruta Carrito de Compras

{ path: 'carrito', component:CarritoComponent,canActivate:[AuthGuard] },
//{ path: 'carrito', component:CarritoComponent},


//Rutas para Usuario
{ path: 'cuenta/direcciones', component:DireccionesComponent},
//{ path: 'perfil/cuenta', component:CuentaComponent },
{ path: 'cuenta/perfil', component:PerfilComponent },


//Rutas del Blog

{ path: 'blog', component:BlogListComponent },
{ path: 'blog/categoria/:categoria', component:BlogListComponent},
{ path: 'blog/:slug', component:SingleBlogComponent },

  //Ruta comodin Para cuando no encuentre ninguna ruta coincidente
  {
    path: '**',
    redirectTo: ''
  }

];
