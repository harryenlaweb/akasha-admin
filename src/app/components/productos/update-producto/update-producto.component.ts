import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { ProductoService } from 'src/app/services/producto.service';
declare var iziToast;
declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-update-producto',
  templateUrl: './update-producto.component.html',
  //styleUrls: ['./update-producto.component.css']
})
export class UpdateProductoComponent implements OnInit {

  public producto : any = {
    descuento:0,
  };
  public file : File = undefined;
  public config : any = {};
  public imgSelect : String | ArrayBuffer;
  public load_btn = false;
  public id;
  public token;
  public url;  
  public config_global : any = {};

  constructor(
    private _route : ActivatedRoute,
    private _productoService:ProductoService,
    private _adminService : AdminService,
    private _router : Router,
  ) {
    this.config = {
      height: 500
    }
    this.token = localStorage.getItem('token');
    this.url = GLOBAL.url;

    this._adminService.obtener_config_publico().subscribe(
      response=>{        
        this.config_global = response.data;
        console.log(this.config_global);
        
      }
    )
    
   }

  ngOnInit(): void {
    
    this._route.params.subscribe(
      params=>{
        this.id = params['id'];
        console.log(this.id);
        this._productoService.obtener_producto_admin(this.id,this.token).subscribe(
          response=>{
            if(response == undefined){
              this.producto = undefined;
            }else{
              this.producto = response.data;
              this.imgSelect = this.url +'obtener_portada/'+ this.producto.portada;
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
        data.portada = this.file;
      }

      data.titulo = this.producto.titulo;
      data.stock = this.producto.stock;
      data.cant_minima_compra = this.producto.cant_minima_compra;
      data.precio = this.producto.precio;
      data.descuento = this.producto.descuento;
      data.codigo = this.producto.codigo;
      data.categoria = this.producto.categoria;
      data.descripcion = this.producto.descripcion;
      data.contenido = this.producto.contenido;

      // Agregar nuevos campos de atributos
      data.categoria_principal = this.producto.categoria_principal;
      data.subcategoria = this.producto.subcategoria;
      data.color = this.producto.color;
      data.talle = this.producto.talle;
      data.marca = this.producto.marca;
      data.genero = this.producto.genero;
      data.temporada = this.producto.temporada;

      console.log(data);
      

      this.load_btn = true;
      this._productoService.actualizar_producto_admin(data,this.id,this.token).subscribe(
        response=>{
          console.log(response);
          iziToast.show({
              title: 'SUCCESS',
              titleColor: '#1DC74C',
              color: '#FFF',
              class: 'text-success',
              position: 'topRight',
              message: 'Se actualizó correctamente el nuevo producto.',        
    
          });
          this.load_btn = false;
          this._router.navigate(['/panel/productos'])
          
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
