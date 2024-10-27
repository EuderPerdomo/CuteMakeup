import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of } from 'rxjs';
import { GLOBAL } from './GLOBAL';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  public url;

  constructor(
    private _http: HttpClient,
    private jwtHelper: JwtHelperService,
  ) {
    this.url = GLOBAL.url;
  }

  login_admin(data: any): Observable<any> {
    console.log('llamo servicio')
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.post(this.url + 'login_admin', data, { headers: headers });
  }

  //Inicia Funciones Modulo clientes
  registro_cliente_admin(data: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this._http.post(this.url + 'registro_cliente_admin', data, { headers: headers });
  }

  listar_clientes_admin(token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this._http.get(this.url + 'listar_clientes_admin', { headers: headers });
  }

  obtener_cliente_admin(id:any,token:any):Observable<any>{
    let headers =new HttpHeaders({'Content-Type':'application/json','Authorization':token})
    return this._http.get(this.url+'obtener_cliente_admin/'+id,{headers:headers})
  }

  actualizar_cliente_admin(data: any, id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this._http.put(this.url + 'actualizar_cliente_admin/' + id, data, { headers: headers });
  }

  eliminar_cliente_admin(id: any, token: any): Observable<any> {
    console.log('Eliminar', id, token)
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this._http.delete(this.url + 'eliminar_cliente_admin/' + id, { headers: headers });
  }

  //Finaliza Funciones Modulo clientes

//Inician funciones de Productos
registro_producto_admin(data: any, file: any, token: any): Observable<any> {
  let headers = new HttpHeaders({ 'Authorization': token });
  const fd = new FormData();
  const fdd=new FormData()
  fd.append('titulo', data.titulo);
  fd.append('etiquetas', JSON.stringify(data.etiquetas));
  fd.append('precio', data.precio);
  fd.append('peso', data.peso);
  fd.append('sku', data.sku);
  fd.append('descripcion', data.descripcion);
  fd.append('contenido', data.contenido);
  fd.append('categoria', data.categoria);
  fd.append('visibilidad', data.visibilidad);
  fd.append('tallas_str', '');
  fd.append('stock', data.stock);
  fd.append('portada', file);
  console.log('datos',fd,data,fd.get('titulo'))
  return this._http.post(this.url + 'registro_producto_admin', fd, { headers: headers });
}

listar_productos_admin(token:any):Observable<any>{
  let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
  return this._http.get(this.url + 'listar_productos_admin',{headers:headers});
}

obtener_producto_admin(id:any,token:any):Observable<any>{
  let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
  return this._http.get(this.url + 'obtener_producto_admin/'+id,{headers:headers});
}
eliminar_etiqueta_admin(id:any,token:any):Observable<any>{
  let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
  return this._http.delete(this.url + 'eliminar_etiqueta_admin/'+id,{headers:headers});
}
crear_etiqueta_producto_global_admin(data:any,token:any):Observable<any>{
  let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
  return this._http.post(this.url+'crear_etiqueta_producto_global_admin',data,{headers:headers});
}

cambiar_vs_producto_admin(id:any,estado:any,token:any):Observable<any>{
  let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
  return this._http.get(this.url+'cambiar_vs_producto_admin/'+id+'/'+estado,{headers:headers});
}

listar_etiquetas_producto_global_admin(token:any):Observable<any>{
  let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
  return this._http.get(this.url + 'listar_etiquetas_producto_global_admin',{headers:headers});
}

listar_etiquetas_producto_admin(id:any,token:any):Observable<any>{
  let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
  return this._http.get(this.url + 'listar_etiquetas_producto_admin/'+id,{headers:headers});
}

eliminar_etiqueta_producto_admin(id:any,token:any):Observable<any>{
  let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
  return this._http.delete(this.url + 'eliminar_etiqueta_producto_admin/'+id,{headers:headers});
}

eliminar_etiqueta_producto_global_admin(id:any,token:any):Observable<any>{
  let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
  return this._http.delete(this.url + 'eliminar_etiqueta_producto_global_admin/'+id,{headers:headers});
}

agregar_etiqueta_producto_admin(data:any,token:any):Observable<any>{
  let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
  return this._http.post(this.url+'agregar_etiqueta_producto_admin',data,{headers:headers});
}

actualizar_producto_admin(data:any,id:any,token:any):Observable<any>{
  if(data.portada){
    let headers = new HttpHeaders({'Authorization':token});
    const fd = new FormData();
    fd.append('titulo', data.titulo);
    fd.append('etiquetas', JSON.stringify(data.etiquetas));
    fd.append('precio', data.precio);
    fd.append('peso', data.peso);
    fd.append('sku', data.sku);
    fd.append('descripcion', data.descripcion);
    fd.append('contenido', data.contenido);
    fd.append('categoria', data.categoria);
    fd.append('visibilidad', data.visibilidad);
    fd.append('tallas_str', '');
    fd.append('stock', data.stock);
    fd.append('portada', data.portada);
console.log('Los datos que estamos enviando',fd)
    return this._http.put(this.url+'actualizar_producto_admin/'+id,fd,{headers:headers});
  }else{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    console.log('Los datos que estamos enviando',data)
    return this._http.put(this.url+'actualizar_producto_admin/'+id,data,{headers:headers});
  }
}

agregar_imagen_galeria_admin(id: any, data: any, token: any): Observable<any> {
  let headers = new HttpHeaders({ 'Authorization': token });
  const fd = new FormData();
  fd.append('_id', data._id);
  fd.append('imagen', data.imagen);
  return this._http.put(this.url + 'agregar_imagen_galeria_admin/' + id, fd, { headers: headers });
}

agregar_imagen_variedad_admin(id: any, data: any, token: any): Observable<any> {
  let headers = new HttpHeaders({ 'Authorization': token });
  const fd = new FormData();
  console.log('datos recibidos ala gregar imagen',data)
  fd.append('id_variedad', data.id_variedad);
  fd.append('imagen', data.imagen);
  return this._http.put(this.url + 'agregar_imagen_variedad_admin/' + id, fd, { headers: headers });
}

//Añadiendo variedades a los productos
agregar_variedad_producto_admin(data:any,token:any,id:any):Observable<any>{
  console.log('variedad recibida',data)
  let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
  return this._http.post(this.url+'agregar_variedad_producto_admin/'+id,data,{headers:headers});
}

agregar_nueva_variedad_producto_admin(data:any,token:any,id:any):Observable<any>{
  let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
  return this._http.post(this.url+'agregar_nueva_variedad_producto_admin/'+id,data,{headers:headers});
}

eliminar_imagen_variedad_admin(id_producto:any,id_variedad:any,id_imagen: any, token: any): Observable<any> {
  let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
  return this._http.delete(this.url + 'eliminar_imagen_variedad_admin/' + id_producto+'/'+id_variedad+'/'+id_imagen, { headers: headers });
}


agregar_nueva_caracteristica_variedad_admin(id_producto:any,id_variedad:any,data: any, token: any): Observable<any> {
  console.log(id_producto,id_variedad,data)
  let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
  return this._http.post(this.url + 'agregar_nueva_caracteristica_variedad_admin/' + id_producto+'/'+id_variedad,data, { headers: headers });
}

editar_caracteristica_variedad_admin(id_producto:any,id_variedad:any,id_carcateristica:any,data: any, token: any): Observable<any> {
  console.log('En servicio',id_producto,id_variedad,id_carcateristica,data)
  let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
  return this._http.put(this.url + 'editar_caracteristica_variedad_admin/' + id_producto+'/'+id_variedad+'/'+id_carcateristica,data, { headers: headers });
}



//Finalizan Productos

      //Inventarios de Productos
      inventario_productos_admin(token:any):Observable<any>{
        let headers=new HttpHeaders({'Content-Type':'application/json','Authorization':token})
        return this._http.get(this.url+'inventario_productos_admin',{headers:headers})
      }



//Inician Categorias

get_categorias(token: any): Observable<any> {
  let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
  return this._http.get(this.url + 'get_categorias', { headers: headers });
}

registro_categoria_admin(data: any, file: any, token: any): Observable<any> {
  let headers = new HttpHeaders({ 'Authorization': token });
  const fd = new FormData();
  fd.append('titulo', data.titulo);
  fd.append('portada', file);
  return this._http.post(this.url + 'registro_categoria_admin', fd, { headers: headers });
}

//Finalizan Categorias

  //Funcion que Valida autenticaci´´on
  isAuthenticated(allowedRoles: string[]): Observable<boolean> {

    const token = localStorage.getItem('token') || '';
    if (!token) {
      return of(false);
    }

    try {
      const decodedToken = this.jwtHelper.decodeToken(token);
      console.log('Token decode',decodedToken)
      if (this.jwtHelper.isTokenExpired(token)) {
        localStorage.clear();
        console.log('Expirado')
        return of(false);
      }

      if (!decodedToken) {
        localStorage.removeItem('token');
        console.log('No decodifica')
        return of(false);
      }

      // Token exists and is valid, check roles
      if (allowedRoles.includes(decodedToken['role'])) { //Antes era rol ahora es role
        console.log('autenticado')
        return of(true);
      } else {
        console.log('No rol')
        return of(false);
      }
    } catch (error) {
      localStorage.removeItem('token');
      console.log('Error')
      return of(false);
    }
  }

/* Mensajes*/
obtener_mensajes_admin(token: any): Observable<any> {
  let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token })
  return this._http.get(this.url + 'obtener_mensajes_admin', { headers: headers })
}

cerrar_mensaje_admin(id: any, data: any, token: any): Observable<any> {
  let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token })
  return this._http.put(this.url + 'cerrar_mensaje_admin/' + id, data, { headers: headers })
}
/* Finaliza Mensajes*/

//Inicia Blog
registro_blog_admin(data: any, file: any, token: any): Observable<any> {
  let headers = new HttpHeaders({ 'Authorization': token });
  const fd = new FormData();
  fd.append('titulo', data.titulo);
  fd.append('etiquetas', JSON.stringify(data.etiquetas));
  fd.append('descripcion', data.descripcion);
  fd.append('contenido', data.contenido);
  fd.append('categoria', data.categoria);
  fd.append('visibilidad', data.visibilidad);
  fd.append('portada', file);

  return this._http.post(this.url + 'registro_blog_admin', fd, { headers: headers });
}

listar_etiquetas_post_global_admin(token: any): Observable<any> {
  let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
  return this._http.get(this.url + 'listar_etiquetas_post_global_admin', { headers: headers });
}

crear_etiqueta_post_global_admin(data:any,token:any):Observable<any>{
  let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
  return this._http.post(this.url+'crear_etiqueta_post_global_admin',data,{headers:headers});
}

eliminar_etiqueta_post_global_admin(id:any,token:any):Observable<any>{
  let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
  return this._http.delete(this.url + 'eliminar_etiqueta_post_global_admin/'+id,{headers:headers});
}


listar_etiquetas_post_admin(token: any): Observable<any> {
  let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
  return this._http.get(this.url + 'listar_etiquetas_post_admin', { headers: headers });
}

eliminar_etiqueta_post_admin(id:any,token:any):Observable<any>{
  let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
  return this._http.delete(this.url + 'eliminar_etiqueta_post_admin/'+id,{headers:headers});
}

crear_etiqueta_post_admin(data:any,token:any):Observable<any>{
  let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
  return this._http.post(this.url+'crear_etiqueta_post_admin',data,{headers:headers});
}


listar_blog_admin(token:any):Observable<any>{
  let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
  return this._http.get(this.url + 'listar_blog_admin',{headers:headers});
}

obtener_blog_admin(id:any,token:any):Observable<any>{
  let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
  return this._http.get(this.url + 'obtener_blog_admin/'+id,{headers:headers});
}

//Finalizan Blog

}
