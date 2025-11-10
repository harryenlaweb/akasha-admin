import { Component, OnInit } from '@angular/core';
import { CuponService } from 'src/app/services/cupon.service';

declare var jQuery:any;
declare var $:any;
declare var iziToast;

@Component({
  selector: 'app-index-cupon',
  templateUrl: './index-cupon.component.html',
  styleUrls: ['./index-cupon.component.css']
})
export class IndexCuponComponent implements OnInit {

  public cupones : Array<any> = [];
  public load_data = true;
  public page = 1;
  public pageSize = 20;
  public filtro = '';
  public token;  

  constructor(
    private _cuponService : CuponService,
  ) {
    this.token = localStorage.getItem('token');
   }

  ngOnInit(): void {
    this._cuponService.listar_cupones_admin(this.filtro, this.token).subscribe(
      response=>{
        this.cupones = response.data;
        this.load_data = false;
        
      }
    )
  }

  filtrar(){
    this._cuponService.listar_cupones_admin(this.filtro, this.token).subscribe(
      response=>{
        this.cupones = response.data;
        this.load_data = false;
        
      }
    )
  }

  eliminar(id){
    this._cuponService.eliminar_cupon_admin(id,this.token).subscribe(
      response=>{
          iziToast.show({
            title: 'SUCCESS',
            titleColor: '#1DC74C',
            color: '#FFF',
            class: 'text-success',
            position: 'topRight',
            message: 'Se eliminó correctamente el cupón.',        
        });

        $('#delete-'+id).modal('hide');
        $('.modal-backdrop').removeClass('show');

        this._cuponService.listar_cupones_admin(this.filtro, this.token).subscribe(
          response=>{
            this.cupones = response.data;
            this.load_data = false;
            
          }
        )
        
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
        
      }
    )
  }
  

}
