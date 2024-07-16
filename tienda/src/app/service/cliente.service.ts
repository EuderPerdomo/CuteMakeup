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
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.get(this.url + 'listar_productos_public/'+filtro, { headers: headers });
  }
  


}
