import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { GLOBAL } from "./GLOBAL";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CatalogoService {

  public url;

  constructor(
    private _http: HttpClient,
  ) {
    this.url = GLOBAL.url;
  } 

  listar_catalogos_publico():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.get(this.url+'listar_catalogos_publico/',{headers:headers});
  }

  eliminar_catalogo_admin(id,token):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.delete(this.url+'eliminar_catalogo_admin/'+id,{headers:headers});
  } 

  registro_catalogo_admin(data,file,token):Observable<any>{
    let headers = new HttpHeaders({'Authorization':token});

    const fd = new FormData();
    fd.append('titulo',data.titulo);
    fd.append('orden',data.orden);    
    fd.append('posicion',data.posicion);
    fd.append('imagen',file);    

    return this._http.post(this.url+'registro_catalogo_admin/',fd,{headers:headers});
  }
  
  obtener_catalogo_admin(id,token):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'obtener_catalogo_admin/'+id,{headers:headers});
  }

  actualizar_catalogo_admin(data,id,token):Observable<any>{
    if(data.imagen){
      let headers = new HttpHeaders({'Authorization':token});

      const fd = new FormData();
      fd.append('titulo',data.titulo);      
      fd.append('orden',data.orden);  
      fd.append('posicion',data.posicion);  
      fd.append('imagen',data.imagen);    

      return this._http.put(this.url+'actualizar_catalogo_admin/'+id,fd,{headers:headers});
    }else{
      let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
      return this._http.put(this.url+'actualizar_catalogo_admin/'+id,data,{headers:headers});
    }

  }

  generar_pdf():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.get(this.url+'generar_pdf/',{headers:headers, responseType: 'blob'});
  }
}
