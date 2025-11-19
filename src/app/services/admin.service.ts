import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { GLOBAL } from "./GLOBAL";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  public url;

  constructor(
    private _http: HttpClient,
  ) {
    this.url = GLOBAL.url;
  }

  login_admin(data):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.post(this.url+'login_admin',data,{headers:headers});

  }

  getToken(){
    return localStorage.getItem('token');
  }

  getIdentity(){
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    try {
      const helper = new JwtHelperService();
      return helper.decodeToken(token);
    } catch (error) {
      return null;
    }
  }

  public isAuthenticated(allowRoles : string[]):boolean{

    const token = localStorage.getItem('token')||'{}';        

    if(!token){
      return false;
    }

    try {
      const helper = new JwtHelperService();
      var decodedToken = helper.decodeToken(token);
      
     
      if(!decodedToken){        
        localStorage.removeItem('token')
        return false;
      }
    } catch (error) {
      localStorage.removeItem('token');
      return false;
    }

    
    return allowRoles.includes(decodedToken['role']);
  }

  /*--------------------CONFIG-----------------------*/

  actualizar_config_admin(id,data,token):Observable<any>{
    let headers = new HttpHeaders({'Authorization':token});

    const fd = new FormData();
    fd.append('titulo',data.titulo);
    fd.append('minimo_compra',data.minimo_compra);
    fd.append('email',data.email);
    
    if(data.categorias){
      fd.append('categorias',JSON.stringify(data.categorias));
    }
    if(data.contacto){
      fd.append('contacto',JSON.stringify(data.contacto));
    }
    
    // Atributos de moda
    if(data.categorias_principales){
      fd.append('categorias_principales',JSON.stringify(data.categorias_principales));
    }
    if(data.colores){
      fd.append('colores',JSON.stringify(data.colores));
    }
    if(data.talles){
      fd.append('talles',JSON.stringify(data.talles));
    }
    if(data.marcas){
      fd.append('marcas',JSON.stringify(data.marcas));
    }
    if(data.temporadas){
      fd.append('temporadas',JSON.stringify(data.temporadas));
    }
    
    if(data.logo_dark){
      fd.append('logo_dark',data.logo_dark);
    }
    if(data.logo_light){
      fd.append('logo_light',data.logo_light);
    }

    return this._http.put(this.url+'actualizar_config_admin/'+id,fd,{headers:headers});
  }
  
  obtener_config_admin(token):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'obtener_config_admin',{headers:headers});
  } 
   
  obtener_config_publico():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.get(this.url+'obtener_config_publico',{headers:headers});
  }

/*---------------CONFIG CATEGORIAS---------------*/

  

  actualizar_config_categoria_admin(id,data,nuevo,indice,token):Observable<any>{    
      let headers = new HttpHeaders({'Authorization':token});

      const fd = new FormData();
      fd.append('categorias',JSON.stringify(data.categorias));
      fd.append('imagen_categoria',nuevo.imagen);
      fd.append('nuevo',JSON.stringify(nuevo));
      fd.append('indice',indice);

      return this._http.put(this.url+'actualizar_config_categoria_admin/'+id,fd,{headers:headers});    
  }

  eliminar_imagen_categoria(id,viejo,token):Observable<any>{

    let headers = new HttpHeaders({'Authorization':token});
    const fd = new FormData();    
    fd.append('viejo',JSON.stringify(viejo));    
    return this._http.put(this.url+'eliminar_imagen_categoria/'+id,fd,{headers:headers});     
  }

  /*---------------CONFIG ABOUT---------------*/
  actualizar_config_about_admin(id,data,token):Observable<any>{

    if(data.imagen_about){
      let headers = new HttpHeaders({'Authorization':token});

      const fd = new FormData();
      fd.append('imagen_about',data.imagen_about);    

      fd.append('historia_about',data.historia_about);
      fd.append('mision_about',data.mision_about);
      fd.append('vision_about',data.vision_about);
      fd.append('valores_about',data.valores_about);

      return this._http.put(this.url+'actualizar_config_about_admin/'+id,fd,{headers:headers});
    }else{
      let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
      return this._http.put(this.url+'actualizar_config_about_admin/'+id,data,{headers:headers});  
    }    
  }

  /*----------------------MENSAJES-----------------------------*/

  obtener_mensajes_admin(token):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'obtener_mensajes_admin',{headers:headers});
  }
  
  cerrar_mensaje_admin(id,data,token):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.put(this.url+'cerrar_mensaje_admin/'+id,data,{headers:headers});
  }

  obtener_ventas_admin(desde,hasta,token):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'obtener_ventas_admin/'+desde+'/'+hasta,{headers:headers});
  }

  cambiar_estado_venta(id,data,token):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.put(this.url+'cambiar_estado_venta/'+id,data,{headers:headers});
  }

  eliminar_venta(id,token):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.delete(this.url+'eliminar_venta/'+id,{headers:headers});
  }
  
  obtener_detalles_ordenes_cliente(id,token):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'obtener_detalles_ordenes_cliente/'+id,{headers:headers});
  }

  //********KPI******* */
  kpi_ganancias_mensuales_admin(token):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'kpi_ganancias_mensuales_admin/',{headers:headers});
  }
}