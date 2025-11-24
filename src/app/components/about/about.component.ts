import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { v4 as uuidv4 } from 'uuid';

declare var iziToast;
declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  public token;
  public config : any = {
    titulo:'Akasha Moda'
  };
  public url;

  public titulo_cat = '';
  public file:File=undefined;
  public imgSelect : String | ArrayBuffer = 'assets/img/01.jpg';
  public tinymceConfig: any = {
    base_url: '/assets/tinymce', // base path set in AppModule.forRoot
    suffix: '.min',
    menubar: false,
    plugins: 'lists link image paste help wordcount',
    toolbar: 'undo redo | formatselect | bold italic underline | alignleft aligncenter alignright | bullist numlist | link image | removeformat | help',
    height: 300,
    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
  };
  
  // Variables para el cropper
  imageChangedEvent: any = '';
  croppedImage: any = '';
  showCropper = false;

  constructor(
    private _adminService: AdminService
  ) {    
    this.token = localStorage.getItem('token');
    this.url = GLOBAL.url;
    
   }

  ngOnInit(): void {
    this.init_data();
  }

  init_data(){
    this._adminService.obtener_config_admin(this.token).subscribe(
      response=>{        
        this.config = response.data;
        if(this.config.imagen_about){
          this.imgSelect = this.url+'obtener_imagen_about/'+this.config.imagen_about;
        }else{
          this.imgSelect = 'assets/img/01.jpg';
        }
        
        console.log(this.config);               
      },
      error=>{
        console.log(error);
        
      }
    );
  }

  
  actualizar(confForm){
    if(confForm.valid){
      let data= {
        imagen_about:this.file,
        historia_about: this.config.historia_about,
        mision_about: this.config.mision_about,
        vision_about: this.config.vision_about,
        valores_about: this.config.valores_about,
        descripcion_about: this.config.descripcion_about,
      }           
      
      this._adminService.actualizar_config_about_admin("617489968545016143869a76",data,this.token).subscribe(
        response=>{
          iziToast.show({
              title: 'SUCCESS',
              titleColor: '#1DC74C',
              color: '#FFF',
              class: 'text-success',
              position: 'topRight',
              message: 'Se actualizó correctamente la configuración.',        
    
          });  
          this.init_data();        
        },
        error=>{
          console.log(error);          
        }
      )
    }else{
      iziToast.show({
          title: 'ERROR',
          titleColor: '#FF0000',
          color: '#FFF',
          class: 'text-danger',
          position: 'topRight',
          message: 'Complete correctamente el formulario',        
        });
    }
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    this.showCropper = true;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    
    // Convertir base64 a File
    this.base64ToFile(event.base64, 'imagen_about.jpg');
  }

  imageLoaded() {
    // Imagen cargada correctamente
  }

  cropperReady() {
    // El cropper está listo
  }

  loadImageFailed() {
    iziToast.show({
      title: 'ERROR',
      titleColor: '#FF0000',
      color: '#FFF',
      class: 'text-danger',
      position: 'topRight',
      message: 'Error al cargar la imagen',
    });
  }

  base64ToFile(base64: string, filename: string) {
    const arr = base64.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    this.file = new File([u8arr], filename, { type: mime });
    this.imgSelect = base64;
  }

  cancelCrop() {
    this.showCropper = false;
    this.imageChangedEvent = '';
  }

  confirmCrop() {
    if (this.croppedImage) {
      this.imgSelect = this.croppedImage;
      this.showCropper = false;
      
      iziToast.show({
        title: 'SUCCESS',
        titleColor: '#1DC74C',
        color: '#FFF',
        class: 'text-success',
        position: 'topRight',
        message: 'Imagen recortada correctamente',
      });
    }
  }

  ngDoCheck(): void {
    $('.cs-file-drop-preview').html("<img src="+this.imgSelect+">");
  }

  eliminar_categoria(idx){
    this.config.categorias.splice(idx,1);

  }

}
