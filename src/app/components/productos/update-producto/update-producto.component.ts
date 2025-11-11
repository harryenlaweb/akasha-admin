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
    colores: [],
    talles: []
  };
  public file : File = undefined;
  public config : any = {};
  public imgSelect : String | ArrayBuffer;
  public load_btn = false;
  public id;
  public token;
  public url;  
  public config_global : any = {};
  public subcategorias_filtradas : any[] = [];
  
  // Variables temporales para los selects
  public color_seleccionado: string = '';
  public talle_seleccionado: string = '';

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
   }

  ngOnInit(): void {
    
    // Primero cargar la configuración global
    this._adminService.obtener_config_publico().subscribe(
      response=>{        
        this.config_global = response.data;
        console.log('Config global cargado:', this.config_global);
        
        // Después cargar el producto
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
                  
                  // Asegurar que colores y talles sean arrays
                  if (!this.producto.colores || !Array.isArray(this.producto.colores)) {
                    this.producto.colores = [];
                  }
                  if (!this.producto.talles || !Array.isArray(this.producto.talles)) {
                    this.producto.talles = [];
                  }
                  
                  // Asegurar que oferta y destacado tengan valores
                  if (this.producto.oferta === undefined) {
                    this.producto.oferta = false;
                  }
                  if (this.producto.destacado === undefined) {
                    this.producto.destacado = false;
                  }
                  
                  // Ahora filtrar subcategorías (config_global ya está cargado)
                  if (this.producto.categoria_principal) {
                    this.onCategoriaPrincipalChange();
                  }
                  
                  this.imgSelect = this.url +'obtener_portada/'+ this.producto.portada;
                }
                
              },
              error=>{
                console.log(error);
              }
            );
            
          }
        );
      }
    );
  }

  // Función para filtrar subcategorías según categoría principal seleccionada
  onCategoriaPrincipalChange() {
    // Guardar subcategoría actual antes de resetear
    const subcategoriaActual = this.producto.subcategoria;
    
    this.subcategorias_filtradas = [];
    
    if (this.producto.categoria_principal && this.config_global.categorias_principales) {
      // Buscar la categoría principal seleccionada
      const categoriaSeleccionada = this.config_global.categorias_principales.find(
        cat => cat.titulo === this.producto.categoria_principal
      );
      
      // Si existe y tiene subcategorías, asignarlas
      if (categoriaSeleccionada && categoriaSeleccionada.subcategorias) {
        this.subcategorias_filtradas = categoriaSeleccionada.subcategorias;
        
        // Verificar si la subcategoría actual existe en las subcategorías filtradas
        const subcategoriaExiste = this.subcategorias_filtradas.some(
          sub => sub.titulo === subcategoriaActual
        );
        
        // Solo resetear si la subcategoría no existe en la nueva lista
        if (!subcategoriaExiste) {
          this.producto.subcategoria = '';
        }
      } else {
        // No hay subcategorías disponibles, resetear
        this.producto.subcategoria = '';
      }
    } else {
      // No hay categoría principal, resetear
      this.producto.subcategoria = '';
    }
  }

  // ============ FUNCIONES PARA COLORES ============
  agregarColor() {
    if (this.color_seleccionado && this.color_seleccionado.trim() !== '') {
      if (!this.producto.colores.includes(this.color_seleccionado)) {
        this.producto.colores.push(this.color_seleccionado);
      }
      this.color_seleccionado = '';
    }
  }

  eliminarColor(index: number) {
    this.producto.colores.splice(index, 1);
  }

  // ============ FUNCIONES PARA TALLES ============
  agregarTalle() {
    if (this.talle_seleccionado && this.talle_seleccionado.trim() !== '') {
      if (!this.producto.talles.includes(this.talle_seleccionado)) {
        this.producto.talles.push(this.talle_seleccionado);
      }
      this.talle_seleccionado = '';
    }
  }

  eliminarTalle(index: number) {
    this.producto.talles.splice(index, 1);
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
      data.colores = this.producto.colores;
      data.talles = this.producto.talles;
      data.marca = this.producto.marca;
      data.temporada = this.producto.temporada;
      
      // Agregar campos de visualización
      data.oferta = this.producto.oferta || false;
      data.destacado = this.producto.destacado || false;

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
