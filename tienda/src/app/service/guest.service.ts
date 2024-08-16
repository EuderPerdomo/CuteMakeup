import { Injectable } from '@angular/core';
import { GLOBAL } from './GLOBAL';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GuestService {

  public url;

  constructor(
    private _http:HttpClient,
    private jwtHelper:JwtHelperService,
  ) {
    this.url = GLOBAL.url;
  }

  obtener_producto_public(slug:any): Observable<any> {
    console.log('consultando producto individual')
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.get(this.url + 'obtener_producto_public/'+slug, { headers: headers });
  }


  listar_productos_recomendado_public(categoria:any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.get(this.url + 'listar_productos_recomendado_public/'+categoria, { headers: headers });
  }
  
  get_regiones():Observable<any>{
    return this._http.get('./assets/regiones.json');
  }

  get_departamentos():Observable<any>{
    return this._http.get('./assets/departamentos.json');
  }

  get_municipios():Observable<any>{
    return this._http.get('./assets/municipios.json');
  }


  //Contactenos

  enviar_mensaje_contacto(data:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json'});
    return this._http.post(this.url + 'enviar_mensaje_contacto',data,{headers:headers});
  }
}


