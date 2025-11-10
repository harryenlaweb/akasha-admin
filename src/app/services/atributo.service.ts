import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { GLOBAL } from "./GLOBAL";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AtributoService {

  public url;

  constructor(
    private _http: HttpClient
  ) { 
    this.url = GLOBAL.url;
  }

  // Crear un nuevo atributo
  registro_atributo_admin(data: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this._http.post(this.url + 'registro_atributo_admin', data, { headers: headers });
  }

  // Listar atributos por tipo
  listar_atributos_admin(tipo: string, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this._http.get(this.url + 'listar_atributos_admin/' + tipo, { headers: headers });
  }

  // Obtener un atributo específico
  obtener_atributo_admin(id: string, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this._http.get(this.url + 'obtener_atributo_admin/' + id, { headers: headers });
  }

  // Actualizar un atributo
  actualizar_atributo_admin(id: string, data: any, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this._http.put(this.url + 'actualizar_atributo_admin/' + id, data, { headers: headers });
  }

  // Eliminar un atributo
  eliminar_atributo_admin(id: string, token: any): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token });
    return this._http.delete(this.url + 'eliminar_atributo_admin/' + id, { headers: headers });
  }

  // Listar atributos públicos
  listar_atributos_publico(tipo: string): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this._http.get(this.url + 'listar_atributos_publico/' + tipo, { headers: headers });
  }
}
