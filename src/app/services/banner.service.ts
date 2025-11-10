import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { GLOBAL } from "./GLOBAL";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class BannerService {

  public url;

  constructor(
    private _http: HttpClient,
  ) {
    this.url = GLOBAL.url;
  }

  listar_banners_admin(filtro,token):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'listar_banners_admin/'+filtro,{headers:headers});
  }

  obtener_banner_por_tipo(tipo,token):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'obtener_banner_por_tipo/'+tipo,{headers:headers});
  } 

  eliminar_banner_admin(id,token):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.delete(this.url+'eliminar_banner_admin/'+id,{headers:headers});
  } 

  registro_banner_admin(data,file,token):Observable<any>{
    let headers = new HttpHeaders({'Authorization':token});

    const fd = new FormData();
    fd.append('titulo',data.titulo);
    fd.append('texto1',data.texto1);
    fd.append('texto2',data.texto2);
    
    // Solo agregar tipo si existe, sino enviar BANNER por defecto
    fd.append('tipo', data.tipo || 'BANNER');
    
    // Solo agregar posicion si el tipo es BANNER y existe el valor
    if (data.tipo === 'BANNER' && data.posicion) {
      fd.append('posicion',data.posicion);
    }
    
    fd.append('banner',file);    

    return this._http.post(this.url+'registro_banner_admin/',fd,{headers:headers});
  }
  
  obtener_banner_admin(id,token):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'obtener_banner_admin/'+id,{headers:headers});
  }

  actualizar_banner_admin(data,id,token):Observable<any>{
    if(data.banner){
      let headers = new HttpHeaders({'Authorization':token});

      const fd = new FormData();
      fd.append('titulo',data.titulo);
      fd.append('texto1',data.texto1);
      fd.append('texto2',data.texto2);
      
      // Solo agregar tipo si existe
      if (data.tipo) {
        fd.append('tipo', data.tipo);
      }
      
      // Solo agregar posicion si el tipo es BANNER y existe el valor
      if (data.tipo === 'BANNER' && data.posicion) {
        fd.append('posicion',data.posicion);
      }
      
      fd.append('banner',data.banner);    

      return this._http.put(this.url+'actualizar_banner_admin/'+id,fd,{headers:headers});
    }else{
      let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
      return this._http.put(this.url+'actualizar_banner_admin/'+id,data,{headers:headers});
    }

  }
}
