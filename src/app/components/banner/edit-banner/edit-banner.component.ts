import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { BannerService } from 'src/app/services/banner.service';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { ImageCroppedEvent } from 'ngx-image-cropper';

declare var iziToast;
declare var jQuery:any;
declare var $:any;
@Component({
  selector: 'app-edit-banner',
  templateUrl: './edit-banner.component.html',
  styleUrls: ['./edit-banner.component.css']
})
export class EditBannerComponent implements OnInit {

  public banner : any = {};
  public file : File = undefined;
  public imgSelect : any | ArrayBuffer = 'assets/img/01.jpg';  
  public token;
  public load_btn = false; 

  public id;
  public url;

  // Variables para el cropper
  imageChangedEvent: any = '';
  croppedImage: any = '';
  showCropper = false;

  constructor(
    private _adminService : AdminService,
    private _bannerService : BannerService,
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
        
        this._bannerService.obtener_banner_admin(this.id,this.token).subscribe(
          response=>{
            if(response == undefined){
              this.banner = undefined;
            }else{
              this.banner = response.data;
              this.imgSelect = this.url +'obtener_banner_banner/'+ this.banner.banner;
            }
            
          }
        ),
        error=>{
          console.log(error);
          
        }
        
      }
    )
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

  actualizar(actualizarForm){
    if(actualizarForm.valid){       
      
        var data : any = {};

        if(this.file != undefined){
          data.banner = this.file;
        }

        data.titulo = this.banner.titulo;
        data.texto1 = this.banner.texto1;
        data.texto2 = this.banner.texto2;
        data.posicion = this.banner.posicion;
        data.tipo = this.banner.tipo;               

        this.load_btn = true;
        this._bannerService.actualizar_banner_admin(data,this.id,this.token).subscribe(
          response=>{
            console.log(response);
            iziToast.show({
                title: 'SUCCESS',
                titleColor: '#1DC74C',
                color: '#FFF',
                class: 'text-success',
                position: 'topRight',
                message: 'Se actualizó correctamente el banner.',        
      
            });
            this.load_btn = false;
            this._router.navigate(['/panel/banners'])
            
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



