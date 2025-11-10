import { Component, DEFAULT_CURRENCY_CODE, OnInit } from '@angular/core';
import { GLOBAL } from "src/app/services/GLOBAL";
import { CatalogoService } from 'src/app/services/catalogo.service';

declare var iziToast;
declare var $:any;

@Component({
  selector: 'app-index-catalogo',
  templateUrl: './index-catalogo.component.html',  
})
export class IndexCatalogoComponent implements OnInit {
  public load_data = true;
  public filtro = '';
  public token;
  public catalogos : Array<any> = [];  
  public url;
  public page = 1;
  public pageSize = 20;

  public load_btn = false;
  public load_btn_pdf = false;

  constructor(
    private _catalogoService : CatalogoService
  ) {
    this.token = localStorage.getItem('token');
    this.url = GLOBAL.url;    
  }

  ngOnInit(): void {    
    this.init_data();
  }

  init_data(){
    this._catalogoService.listar_catalogos_publico().subscribe(
      response=>{        
        this.catalogos = response.data;                
        this.load_data = false; 
        this.load_btn_pdf = false;
      },
      error=>{
        console.log(error);
        
      }
    )

   
  }


  resetear(){
    this.filtro = '';
    this.init_data();
  }

  onDownloadClick(): void {
    this.load_btn_pdf = true;

    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;
    const fileName = `Catálogo Akasha Moda ${formattedDate}.pdf`;

    this._catalogoService.generar_pdf().subscribe(
      (response: Blob) => {
        if (response && response.size > 0) {
          const downloadLink = document.createElement('a');
          downloadLink.href = URL.createObjectURL(response);
          downloadLink.download = fileName;
          downloadLink.click();
          this.load_btn_pdf = false;
        } else {
          console.error('La respuesta del servidor es nula o vacía.');          
        }
      },
      (error) => {
        console.error('Error al descargar el archivo:', error);        
      }
    );
    
  }

  eliminar(id){
    this.load_btn = true;
    this._catalogoService.eliminar_catalogo_admin(id,this.token).subscribe(
      response=>{
        iziToast.show({
            title: 'SUCCESS',
            titleColor: '#1DC74C',
            color: '#FFF',
            class: 'text-success',
            position: 'topRight',
            message: 'Se eliminó correctamente el nuevo catalogo.',        
        });

      $('#delete-'+id).modal('hide');
      $('.modal-backdrop').removeClass('show');

      this.load_btn = false;

      this.init_data();
        
      },
      error=>{
        iziToast.show({
            title: 'ERROR',
            titleColor: '#FF0000',
            color: '#FFF',
            class: 'text-danger',
            position: 'topRight',
            message: 'Ocurrió un error en el servidor.',        
        });
        console.log(error);
        this.load_btn = false;
        
      }
    )
  }
}
