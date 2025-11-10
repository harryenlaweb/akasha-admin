import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { CatalogoService } from 'src/app/services/catalogo.service';
import { GLOBAL } from 'src/app/services/GLOBAL';

declare var iziToast;
declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-edit-catalogo',
  templateUrl: './edit-catalogo.component.html',  
})
export class EditCatalogoComponent implements OnInit {
  public catalogo : any = {};
  public file : File = undefined;
  public imgSelect : any | ArrayBuffer = 'assets/img/01.jpg';  
  public token;
  public load_btn = false; 

  public id;
  public url;

  constructor(
    private _adminService : AdminService,
    private _catalogoService : CatalogoService,
    private _router : Router,
    private _route : ActivatedRoute
  ) {
    this.token = this._adminService.getToken();
    this.url = GLOBAL.url;
  }

  ngOnInit(): void {
    this._route.params.subscribe(
      params=>{
        this.id = params['id'];
        
        this._catalogoService.obtener_catalogo_admin(this.id,this.token).subscribe(
          response=>{
            if(response == undefined){
              this.catalogo = undefined;
            }else{
              this.catalogo = response.data;
              this.imgSelect = this.url +'obtener_imagen_catalogo/'+ this.catalogo.imagen;
            }
            
          }
        ),
        error=>{
          console.log(error);
          
        }
        
      }
    )
  }

  actualizar(actualizarForm){
    if(actualizarForm.valid){       
      
        var data : any = {};

        if(this.file != undefined){
          data.imagen = this.file;
        }

        data.titulo = this.catalogo.titulo;
        data.orden = this.catalogo.orden;
        data.posicion = this.catalogo.posicion;               

        this.load_btn = true;
        this._catalogoService.actualizar_catalogo_admin(data,this.id,this.token).subscribe(
          response=>{
            console.log(response);
            iziToast.show({
                title: 'SUCCESS',
                titleColor: '#1DC74C',
                color: '#FFF',
                class: 'text-success',
                position: 'topRight',
                message: 'Se actualizó correctamente el catalogo.',        
      
            });
            this.load_btn = false;
            this._router.navigate(['/panel/catalogo'])
            
          },
          error=>{
            console.log(error);
            this.load_btn = false;
          }
        
      );      

    }else{
      iziToast.show({
          title: 'ERROR',
          titleColor: '#FF0000',
          color: '#FFF',
          class: 'text-danger',
          position: 'topRight',
          message: 'Los datos del formulario no son validos',        

      });
      this.load_btn = false;
    }
  }

  fileChangeEvent(event:any):void{
    var file;
    if(event.target.files && event.target.files[0]){
      file = <File>event.target.files[0];
      console.log(file);
      
    }else{
      iziToast.show({
          title: 'ERROR',
          titleColor: '#FF0000',
          color: '#FFF',
          class: 'text-danger',
          position: 'topRight',
          message: 'No hay una imagen de envío',        

      });
      $('#input-portada').text('Seleccionar imagen');
      this.imgSelect = 'assets/img/01.jpg';
      this.file = undefined;
    }


    if(file.size <= 4000000){ //el tamaño de la imagen tiene que ser menor a 4MB
      if(file.type == 'image/png' || file.type == 'image/webp' || file.type == 'image/jpg' || file.type == 'image/gif' || file.type == 'image/jpeg'){
        const reader = new FileReader();
        reader.onload = e => this.imgSelect = reader.result;        
        
        reader.readAsDataURL(file); //la variable imgSelect tiene una base 64 --> es solo una cadena extensa que me genera una imagen

        $('#input-portada').text(file.name);
        this.file = file;
      }else{
        iziToast.show({
            title: 'ERROR',
            titleColor: '#FF0000',
            color: '#FFF',
            class: 'text-danger',
            position: 'topRight',
            message: 'El archivo debe ser una imagen',        

        });
        $('#input-portada').text('Seleccionar imagen');
        this.imgSelect = 'assets/img/01.jpg';
        this.file = undefined;        
      }
    }else{
      iziToast.show({
          title: 'ERROR',
          titleColor: '#FF0000',
          color: '#FFF',
          class: 'text-danger',
          position: 'topRight',
          message: 'E archivo no puede superar los 4 MB',        

      });
      $('#input-portada').text('Seleccionar imagen');
      this.imgSelect = 'assets/img/01.jpg';
      this.file = undefined;      
    }
    
    console.log(this.file);
    

  }


}
