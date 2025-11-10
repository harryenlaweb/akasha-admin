import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { BannerService } from 'src/app/services/banner.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';

declare var iziToast;
declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-create-banner',
  templateUrl: './create-banner.component.html',
  styleUrls: ['./create-banner.component.css']
})
export class CreateBannerComponent implements OnInit {

  public banner : any = {};
  public file : File = undefined;
  public imgSelect : any | ArrayBuffer = 'assets/img/01.jpg';  
  public token;
  public load_btn = false;
  
  // Variables para el cropper
  imageChangedEvent: any = '';
  croppedImage: any = '';
  showCropper = false;

  constructor(
    private _adminService : AdminService,
    private _bannerService : BannerService,
    private _router : Router,
  ) {
    this.token = this._adminService.getToken();
  }

  ngOnInit(): void {
  }

  // Obtener dimensiones según el tipo
  getBannerDimensions() {
    if (this.banner.tipo === 'IMAGEN1A' || this.banner.tipo === 'IMAGEN1B') {
      return { width: 1350, height: 680 };
    } else if (this.banner.tipo === 'IMAGEN2') {
      return { width: 1920, height: 606 };
    } else {
      // BANNER por defecto
      return { width: 1920, height: 650 };
    }
  }

  getBannerAspectRatio() {
    const dims = this.getBannerDimensions();
    return dims.width / dims.height;
  }

  getBannerResolutionText() {
    const dims = this.getBannerDimensions();
    return `Resolución: ${dims.width} x ${dims.height} píxeles`;
  }

  getBannerCropperTitle() {
    const dims = this.getBannerDimensions();
    return `Recortar Banner - ${dims.width} x ${dims.height} px`;
  }

  registro(registroForm){
    if(registroForm.valid){
      if(this.file == undefined){
        iziToast.show({
            title: 'ERROR',
            titleColor: '#FF0000',
            color: '#FFF',
            class: 'text-danger',
            position: 'topRight',
            message: 'Debe subir un banner para registrar',        

        });
      }else{
        // Verificar si es un tipo único (IMAGEN1A, IMAGEN1B, IMAGEN2)
        const tiposUnicos = ['IMAGEN1A', 'IMAGEN1B', 'IMAGEN2'];
        
        if (tiposUnicos.includes(this.banner.tipo)) {
          // Verificar si ya existe un banner de este tipo
          this.load_btn = true;
          this._bannerService.obtener_banner_por_tipo(this.banner.tipo, this.token).subscribe(
            response => {
              if (response.data) {
                // Ya existe, actualizar
                const bannerExistente = response.data;
                this.banner.banner = this.file;
                
                this._bannerService.actualizar_banner_admin(this.banner, bannerExistente._id, this.token).subscribe(
                  updateResponse => {
                    iziToast.show({
                      title: 'SUCCESS',
                      titleColor: '#1DC74C',
                      color: '#FFF',
                      class: 'text-success',
                      position: 'topRight',
                      message: `Banner ${this.banner.tipo} actualizado correctamente (solo puede existir uno de este tipo).`,        
                    });
                    this.load_btn = false;
                    this._router.navigate(['/panel/banners']);
                  },
                  error => {
                    console.log(error);
                    this.load_btn = false;
                  }
                );
              } else {
                // No existe, crear nuevo
                this.crearNuevoBanner();
              }
            },
            error => {
              // Si hay error (probablemente no existe), crear nuevo
              this.crearNuevoBanner();
            }
          );
        } else {
          // Es tipo BANNER, permitir múltiples
          this.crearNuevoBanner();
        }
      }
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
      this.imgSelect = 'assets/img/01.jpg';
      this.file = undefined;  
    }
  }

  crearNuevoBanner() {
    this.load_btn = true;
    this._bannerService.registro_banner_admin(this.banner, this.file, this.token).subscribe(
      response => {
        iziToast.show({
          title: 'SUCCESS',
          titleColor: '#1DC74C',
          color: '#FFF',
          class: 'text-success',
          position: 'topRight',
          message: 'Se registro correctamente el nuevo banner.',        
        });
        this.load_btn = false;
        this._router.navigate(['/panel/banners']);            
      },
      error => {
        console.log(error);
        this.load_btn = false;
      }
    );
  }

  fileChangeEvent(event:any):void{
    this.imageChangedEvent = event;
    this.showCropper = true;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    this.base64ToFile(event.base64, 'banner.png');
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

}
