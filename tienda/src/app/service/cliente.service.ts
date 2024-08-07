import { Injectable } from '@angular/core';
import { GLOBAL } from './GLOBAL';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  public url;

  constructor(
    private _http:HttpClient,
    private jwtHelper:JwtHelperService,
  ) {
    this.url = GLOBAL.url;
  }

  login_cliente(data: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.post(this.url + 'login_cliente', data, { headers: headers });
  }

  obtener_cliente_guest(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token })
    return this._http.get(this.url + 'obtener_cliente_guest/' + id, { headers: headers })
  }
  

  get_categorias_publico(): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.get(this.url + 'get_categorias_publico', { headers: headers });
  }
  
  listar_productos_public(filtro:any): Observable<any> {
    console.log('consultando productos')
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.get(this.url + 'listar_productos_public/'+filtro, { headers: headers });
  }
  

  public isAuthenticate(allowedroles: string[]): boolean {
    const token = String(localStorage.getItem('token') || '');
    if (!token) {
      return false
    }
    try {
      const helper = new JwtHelperService();
      var decodedToken = helper.decodeToken(token);
      console.log(decodedToken,decodedToken['role'],decodedToken['rol'])
      if (helper.isTokenExpired(token)) {
        localStorage.clear()
        return false
      } 
      if (!decodedToken) {
        localStorage.removeItem('token')
        return false
      }
  
    } catch (error) {
      localStorage.removeItem('token')
      return false
    }
    //En este punto el token existe y es valido, se verifican los permisos
    if(allowedroles.includes(decodedToken['role'])){
      console.log('Token decofificado',decodedToken['role'])
      return true
    }else{
      return false //retornar identificador de permiso invalido
    }
  
  }
  

  //Carito de comptras

  agregar_carrito_cliente(data: any, token: any): Observable<any> {

    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token })
    return this._http.post(this.url + 'agregar_carrito_cliente', data, { headers: headers })
  }


  obtener_carrito_cliente(id: any, token: any): Observable<any> {
    console.log(id,'Id en el servicio')
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token })
    return this._http.get(this.url + 'obtener_carrito_cliente/'+ id, { headers: headers })
  }

  eliminar_carrito_cliente(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token })
    return this._http.delete(this.url + 'eliminar_carrito_cliente/'+ id, { headers: headers })
  }


//Direcciones


registro_direccion_cliente(data: any, token: any): Observable<any> {
  let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token })
  return this._http.post(this.url + 'registro_direccion_cliente', data, { headers: headers })
}

}
