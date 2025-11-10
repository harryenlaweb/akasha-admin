import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { ImageCroppedEvent } from 'ngx-image-cropper';

declare var iziToast;
declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent implements OnInit {

  public token;
  public config : any = null;
  public url;

  public file_dark:File=undefined;
  public file_light:File=undefined;
  public imgSelect_dark : String | ArrayBuffer = 'assets/img/01.jpg';
  public imgSelect_light : String | ArrayBuffer = 'assets/img/01.jpg';

  public load_btn = false;

  // Variables para el cropper dark
  imageChangedEvent_dark: any = '';
  croppedImage_dark: any = '';
  showCropper_dark = false;

  // Variables para el cropper light
  imageChangedEvent_light: any = '';
  croppedImage_light: any = '';
  showCropper_light = false;


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
        if(response.data) {
          this.config = response.data;
          
          // Inicializar contacto si no existe
          if(!this.config.contacto) {
            this.config.contacto = {
              direccion: '',
              telefono: '',
              email: '',
              horario: ''
            };
          }
          
          if(this.config.logo_dark) {
            this.imgSelect_dark = this.url+'obtener_logo_dark/'+this.config.logo_dark;
          }
          if(this.config.logo_light) {
            this.imgSelect_light = this.url+'obtener_logo_light/'+this.config.logo_light;
          }
          console.log(this.config);
        } else {
          console.log('No se encontró configuración');
        }
      },
      error=>{
        console.log(error);
        
      }
    );
  }

  actualizar(confForm){

    if(confForm.valid && this.config){
      // Obtener token actualizado
      this.token = localStorage.getItem('token');
      
      if(!this.token){
        iziToast.show({
          title: 'ERROR',
          titleColor: '#FF0000',
          color: '#FFF',
          class: 'text-danger',
          position: 'topRight',
          message: 'Sesión expirada. Por favor inicie sesión nuevamente.',
        });
        return;
      }
      
      let data= {
        titulo: confForm.value.titulo,
        minimo_compra: this.config.minimo_compra,
        email: this.config.email,       
        logo_dark: this.file_dark,
        logo_light: this.file_light,
        contacto: this.config.contacto
      }     
      console.log(data);
      
      this._adminService.actualizar_config_admin("617489968545016143869a76",data,this.token).subscribe(
        response=>{
          iziToast.show({
              title: 'SUCCESS',
              titleColor: '#1DC74C',
              color: '#FFF',
              class: 'text-success',
              position: 'topRight',
              message: 'Se actualizó correctamente la configuración.',        
    
          });
          
          // Recargar la configuración para mostrar el nuevo logo
          this.init_data();
          
        },
        error=>{
          console.log(error);
          if(error.status === 403){
            iziToast.show({
              title: 'ERROR',
              titleColor: '#FF0000',
              color: '#FFF',
              class: 'text-danger',
              position: 'topRight',
              message: 'Token inválido o expirado. Por favor inicie sesión nuevamente.',
            });
          }else{
            iziToast.show({
              title: 'ERROR',
              titleColor: '#FF0000',
              color: '#FFF',
              class: 'text-danger',
              position: 'topRight',
              message: 'Error al actualizar la configuración.',
            });
          }
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

  // Métodos para logo dark
  fileChangeEvent_dark(event: any): void {
    this.imageChangedEvent_dark = event;
    this.showCropper_dark = true;
  }

  imageCropped_dark(event: ImageCroppedEvent) {
    this.croppedImage_dark = event.base64;
    this.base64ToFile_dark(event.base64, 'logo-dark.png');
  }

  base64ToFile_dark(base64: string, filename: string) {
    const arr = base64.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    this.file_dark = new File([u8arr], filename, { type: mime });
    this.imgSelect_dark = base64;
  }

  cancelCrop_dark() {
    this.showCropper_dark = false;
    this.imageChangedEvent_dark = '';
  }

  confirmCrop_dark() {
    if (this.croppedImage_dark) {
      this.imgSelect_dark = this.croppedImage_dark;
      this.showCropper_dark = false;
      
      iziToast.show({
        title: 'SUCCESS',
        titleColor: '#1DC74C',
        color: '#FFF',
        class: 'text-success',
        position: 'topRight',
        message: 'Logo oscuro recortado correctamente',
      });
    }
  }

  // Métodos para logo light
  fileChangeEvent_light(event: any): void {
    this.imageChangedEvent_light = event;
    this.showCropper_light = true;
  }

  imageCropped_light(event: ImageCroppedEvent) {
    this.croppedImage_light = event.base64;
    this.base64ToFile_light(event.base64, 'logo-light.png');
  }

  base64ToFile_light(base64: string, filename: string) {
    const arr = base64.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    this.file_light = new File([u8arr], filename, { type: mime });
    this.imgSelect_light = base64;
  }

  cancelCrop_light() {
    this.showCropper_light = false;
    this.imageChangedEvent_light = '';
  }

  confirmCrop_light() {
    if (this.croppedImage_light) {
      this.imgSelect_light = this.croppedImage_light;
      this.showCropper_light = false;
      
      iziToast.show({
        title: 'SUCCESS',
        titleColor: '#1DC74C',
        color: '#FFF',
        class: 'text-success',
        position: 'topRight',
        message: 'Logo claro recortado correctamente',
      });
    }
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

  ngDoCheck(): void {
    $('#select_dark').html("<img src="+this.imgSelect_dark+">");
    $('#select_light').html("<img src="+this.imgSelect_light+">");
  }

}
