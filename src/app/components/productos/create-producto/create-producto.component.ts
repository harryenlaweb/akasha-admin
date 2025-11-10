import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { ProductoService } from 'src/app/services/producto.service';

declare var iziToast;
declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-create-producto',
  templateUrl: './create-producto.component.html',
  //styleUrls: ['./create-producto.component.css']
})
export class CreateProductoComponent implements OnInit {

  public producto : any = {
    descuento:0,
    stock:1,
    precio:1,
    cant_minima_compra:1,
    desripcion:'',
    contenido:'',
    categoria_principal: '',
    subcategoria: '',
    colores: [],  // Array para colores seleccionados
    talles: [],   // Array para talles seleccionados
    marca: '',
    temporada: ''
  };
  public file : File = undefined;
  public imgSelect : any | ArrayBuffer = 'assets/img/01.jpg';
  public config : any = {};
  public token;
  public load_btn = false;   
  public config_global : any = {};
  public subcategorias_filtradas : any[] = [];
  
  // Variables temporales para los selects
  public color_seleccionado: string = '';
  public talle_seleccionado: string = '';

  constructor(
    private _productoService : ProductoService,
    private _adminService : AdminService,
    private _router : Router,
  ) {
    this.config = {
      height: 500
    }
    this.token = this._adminService.getToken();
    this._adminService.obtener_config_publico().subscribe(
      response=>{        
        this.config_global = response.data;        
        
      }
    )
   }

  ngOnInit(): void {
  }

  // Función para filtrar subcategorías según categoría principal seleccionada
  onCategoriaPrincipalChange() {
    // Resetear subcategoría seleccionada
    this.producto.subcategoria = '';
    this.subcategorias_filtradas = [];
    
    if (this.producto.categoria_principal && this.config_global.categorias_principales) {
      // Buscar la categoría principal seleccionada
      const categoriaSeleccionada = this.config_global.categorias_principales.find(
        cat => cat.titulo === this.producto.categoria_principal
      );
      
      // Si existe y tiene subcategorías, asignarlas
      if (categoriaSeleccionada && categoriaSeleccionada.subcategorias) {
        this.subcategorias_filtradas = categoriaSeleccionada.subcategorias;
      }
    }
  }

  // ============ FUNCIONES PARA COLORES ============
  agregarColor() {
    if (this.color_seleccionado && this.color_seleccionado.trim() !== '') {
      // Verificar que no esté ya agregado
      if (!this.producto.colores.includes(this.color_seleccionado)) {
        this.producto.colores.push(this.color_seleccionado);
      }
      // Resetear el select
      this.color_seleccionado = '';
    }
  }

  eliminarColor(index: number) {
    this.producto.colores.splice(index, 1);
  }

  // ============ FUNCIONES PARA TALLES ============
  agregarTalle() {
    if (this.talle_seleccionado && this.talle_seleccionado.trim() !== '') {
      // Verificar que no esté ya agregado
      if (!this.producto.talles.includes(this.talle_seleccionado)) {
        this.producto.talles.push(this.talle_seleccionado);
      }
      // Resetear el select
      this.talle_seleccionado = '';
    }
  }

  eliminarTalle(index: number) {
    this.producto.talles.splice(index, 1);
  }

  

  registro(registroForm){
    console.log('Form valid:', registroForm.valid);
    console.log('Form value:', registroForm.value);
    console.log('Producto data:', this.producto);
    
    if(registroForm.valid){
      
      // Validaciones específicas con mensajes claros
      let errores = [];
      
      if(!this.file){
        errores.push('Debe subir una imagen de portada');
      }
      
      if(!this.producto.categoria_principal || this.producto.categoria_principal === ''){
        errores.push('Debe seleccionar una categoría principal');
      }
      
      if(!this.producto.subcategoria || this.producto.subcategoria === ''){
        errores.push('Debe seleccionar una subcategoría');
      }
      
      if(!this.producto.marca || this.producto.marca === ''){
        errores.push('Debe seleccionar una marca');
      }
      
      if(!this.producto.temporada || this.producto.temporada === ''){
        errores.push('Debe seleccionar una temporada');
      }
      
      if(this.producto.colores.length === 0){
        errores.push('Debe agregar al menos un color');
      }
      
      if(this.producto.talles.length === 0){
        errores.push('Debe agregar al menos un talle');
      }
      
      // Si hay errores, mostrarlos
      if(errores.length > 0){
        iziToast.show({
            title: 'CAMPOS REQUERIDOS',
            titleColor: '#FF0000',
            color: '#FFF',
            class: 'text-danger',
            position: 'topRight',
            message: errores.join('<br>'),
        });
        return;
      }
      
      // Si todo está bien, proceder con el registro
      this.load_btn = true;
      this._productoService.registro_producto_admin(this.producto,this.file,this.token).subscribe(
        response=>{
            iziToast.show({
                title: 'SUCCESS',
                titleColor: '#1DC74C',
                color: '#FFF',
                class: 'text-success',
                position: 'topRight',
                message: 'Se registro correctamente el nuevo producto.',        
      
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

      $('#input-portada').text('Seleccionar imagen');
      //this.imgSelect = 'assets/img/01.jpg';
      //this.file = undefined;  
    }
  }    
  

  async fileChangeEvent(event: any): Promise<void> {
    try {
      if (event.target.files && event.target.files[0]) {
        const file = <File>event.target.files[0];

          if ( file.type === 'image/png' || file.type === 'image/webp' || file.type === 'image/jpg' ||
            file.type === 'image/gif' || file.type === 'image/jpeg') 
          {
            const compressedBlob = await this.compressImage(file, 500, 500, 0.75);
  
            // Crear una nueva instancia de File con las propiedades necesarias
            const compressedFile = new File([compressedBlob], file.name, {
              type: file.type,
              lastModified: file.lastModified
            });
  
            const reader = new FileReader();
            reader.onload = (e) => {
              this.imgSelect = reader.result as string;
            };
            reader.readAsDataURL(compressedFile); // imgSelect contiene una base64
  
            $('#input-portada').text(file.name);
            this.file = compressedFile;
          } else {
            this.showErrorMessage('El archivo debe ser una imagen');
          }
        
      } else {
        this.showErrorMessage('No hay una imagen de envío');
      }
    } catch (error) {
      console.error('Error al procesar la imagen: ', error);
    }
  }
  
  private showErrorMessage(message: string): void {
    iziToast.show({
      title: 'ERROR',
      titleColor: '#FF0000',
      color: '#FFF',
      class: 'text-danger',
      position: 'topRight',
      message: message,
    });
  
    $('#input-portada').text('Seleccionar imagen');
    this.imgSelect = 'assets/img/01.jpg';
    this.file = undefined;
  }
  
  

  //funcion para comprimir la imagen de la funcion fileChangeEvent
  async compressImage(inputImage: File, maxWidth: number, maxHeight: number, quality: number): Promise<Blob> {
    return new Promise<Blob>((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(inputImage);
  
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
  
        let width = img.width;
        let height = img.height;
  
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
  
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
  
        canvas.width = width;
        canvas.height = height;
  
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
  
        canvas.toBlob((blob) => {
          if (blob) {
            console.log('El tamaño del Blob de la imagen comprimida es: ', blob.size);
            resolve(blob);
          } else {
            reject(new Error('Error al comprimir la imagen.'));
          }
        }, 'image/jpeg', quality);
      };
  
      img.onerror = () => {
        reject(new Error('Error al cargar la imagen.'));
      };
    });
  }
  

  




}
