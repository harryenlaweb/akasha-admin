import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';

declare var iziToast;
declare var $:any;

@Component({
  selector: 'app-index-ventas',
  templateUrl: './index-ventas.component.html',
  styleUrls: ['./index-ventas.component.css']
})
export class IndexVentasComponent implements OnInit {

  public token;
  public desde;
  public hasta;

  public ventas : Array<any>=[];
  public page = 1;
  public pageSize = 15;  
  
  public load_btn_pago = false; 
  public load_btn_entrega = false;

  constructor(
    private _adminService:AdminService,
  ) { 
    this.token = localStorage.getItem('token');
  }

  ngOnInit(): void {
    this.init_Data();
  }

  init_Data(){
    this._adminService.obtener_ventas_admin(this.desde,this.hasta,this.token).subscribe(
      response=>{        
        this.ventas = response.data;
      }
    );
  }

  filtrar(){
    this._adminService.obtener_ventas_admin(this.desde,this.hasta,this.token).subscribe(
      response=>{
        this.ventas = response.data;

      }
    )
  }

  cambiar_estado_venta(idVenta, nuevo_valor,estado){
    if (estado == 'pago') {
      this.load_btn_pago = true;
      this._adminService.cambiar_estado_venta(idVenta,{estado:estado,nuevo_valor:nuevo_valor},this.token).subscribe(
        response=>{
          iziToast.show({
            title: 'SUCCESS',
            titleColor: '#1DC74C',
            color: '#FFF',
            class: 'text-success',
            position: 'topRight',
            message: 'Se modificó el estado de pago',        
          });
  
          $('#cambiar_pago-'+idVenta).modal('hide');
          $('.modal-backdrop').removeClass('show');
    
          this.load_btn_pago = false;
          this.init_Data();
        }
      );
    }

    if (estado == 'entrega'){
      this.load_btn_entrega = true;
      this._adminService.cambiar_estado_venta(idVenta,{estado:estado,nuevo_valor:nuevo_valor},this.token).subscribe(
        response=>{
          iziToast.show({
            title: 'SUCCESS',
            titleColor: '#1DC74C',
            color: '#FFF',
            class: 'text-success',
            position: 'topRight',
            message: 'Se modificó la entrega',        
          });
  
          $('#cambiar_entrega-'+idVenta).modal('hide');
          $('.modal-backdrop').removeClass('show');
    
          this.load_btn_entrega = false;
          this.init_Data();
        }
      );
    }

  }

  eliminar(id){
    this._adminService.eliminar_venta(id,this.token).subscribe(
      response=>{
        console.log(response.venta);
        console.log(response.detalles);
        iziToast.show({
          title: 'SUCCESS',
          titleColor: '#1DC74C',
          color: '#FFF',
          class: 'text-success',
          position: 'topRight',
          message: 'Se eliminó la venta',        
        });

        $('#cambiar_delete-'+id).modal('hide');
        $('.modal-backdrop').removeClass('show');    
        
        this.init_Data();
      }
    );
  }

  /* eliminar(id){
    this.load_btn = true;
    this._productoService.eliminar_producto_admin(id,this.token).subscribe(
      response=>{
        iziToast.show({
            title: 'SUCCESS',
            titleColor: '#1DC74C',
            color: '#FFF',
            class: 'text-success',
            position: 'topRight',
            message: 'Se eliminó correctamente el nuevo producto.',        
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
  } */

  /* cambiar_estado_pago(idVenta, nuevo_valor){
    console.log(idVenta, nuevo_valor);

    this._adminService.cambiar_estado_pago(idVenta,{nuevo_valor:nuevo_valor},this.token).subscribe(
      response=>{
        this.init_Data();
      }
    );
  } */

}
