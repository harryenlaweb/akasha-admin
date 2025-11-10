import { Component, DEFAULT_CURRENCY_CODE, OnInit } from '@angular/core';
import { GLOBAL } from "src/app/services/GLOBAL";
import { ProductoService } from 'src/app/services/producto.service';
import { AdminService } from 'src/app/services/admin.service';

import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

declare var $:any;
declare var iziToast;

@Component({
  selector: 'app-index-producto',
  templateUrl: './index-producto.component.html',
  styleUrls: ['./index-producto.component.css']
})
export class IndexProductoComponent implements OnInit {

  public file_precios : File = undefined;
  public imgSelect : any | ArrayBuffer = 'assets/img/01.jpg';

  public load_data = true;
  public filtro = '';
  public token;
  public productos : Array<any> = [];
  public arr_productos : Array<any> = [];
  public url;
  public page = 1;
  public pageSize = 20;

  public load_btn = false;

  constructor(
    private _productoService : ProductoService,
    private _adminService:AdminService,
  ) {
    this.token = localStorage.getItem('token');
    this.url = GLOBAL.url;    
   }

  ngOnInit(): void {
    this.init_data();
  }

  init_data(){
    this._productoService.listar_productos_admin(this.filtro, this.token).subscribe(
      response=>{        
        this.productos = response.data;
        this.productos.forEach(element => {
          this.arr_productos.push({
            codigo: element.codigo,
            titulo: element.titulo,
            stock: element.stock,
            cant_minima_compra: element.cant_minima_compra,
            precio: element.precio,
            categoria: element.categoria,
            nventas: element.nventas,
          });
        });

        this.load_data = false;
        
      },
      error=>{
        console.log(error);
        
      }
    )
  }

  filtrar(){
    if(this.filtro){
      this._productoService.listar_productos_admin(this.filtro, this.token).subscribe(
        response=>{          
          this.productos = response.data;
          this.load_data = false;
          
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
          message: 'Los datos del formulario no son validos',        

      });
    }
  }

  resetear(){
    this.filtro = '';
    this.init_data();
  }

  eliminar(id){
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
  }

  download_excel(){
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet("Reporte de productos");

    worksheet.addRow(undefined);
    for (let x1 of this.arr_productos){
      let x2 = Object.keys(x1);

      let temp=[];
      for(let y of x2){
        temp.push(x1[y])
      }
      worksheet.addRow(temp)
    }

    let fname='REP01- ';

    worksheet.columns = [
      { header: 'Código', key: 'col1', width: 30},
      { header: 'Descripción', key: 'col2', width: 15},
      { header: 'Cantidad', key: 'col3', width: 15},
      { header: 'Precio', key: 'col4', width: 25},
      { header: 'Categoría', key: 'col5', width: 15},
      { header: 'Ventas', key: 'col6', width: 15},
    ]as any;

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      fs.saveAs(blob, fname+'-'+new Date().valueOf()+'.xlsx');
    })
  }

  async fileChangeEvent_precios(event:any){
    var file_precios;
    if(event.target.files && event.target.files[0]){
      file_precios = <File>event.target.files[0];

      var arr_prod=[];

      const workbook = new Workbook();
      const file = await workbook.xlsx.load(file_precios as Buffer)
      .then(function() {          
          var worksheet = workbook.getWorksheet("Hoja 1");
          worksheet.eachRow({ includeEmpty: true }, function(row, rowNumber) {
            if (rowNumber >= 7){ //comienzo a tomar datos desde la linea 7 inclusive
              if (row.values[1]){ //si existe el codigo    
                var c = row.values[1];
                var p = parseFloat(row.values[5]); //columna del precio         
                arr_prod.push({codigo:c, precio:p});
              }              
            }                      
          });
      }); 
      this._productoService.actualizar_precio_producto_admin(arr_prod,this.token).subscribe(                  
        response=>{ this.init_data(); },
        error=>{ console.log(error) }
      );

      // arr_prod.forEach((item) => {
      //   var data = { codigo : item.codigo, precio : parseFloat(item.precio)};
      // });
    }

  }

  async fileChangeEvent_stock(event:any){
    var file_stock;
    if(event.target.files && event.target.files[0]){
      file_stock = <File>event.target.files[0];

      var arr_prod=[];

      const workbook = new Workbook();
      const file = await workbook.xlsx.load(file_stock as Buffer)
      .then(function() {          
          var worksheet = workbook.getWorksheet("Hoja 1");
          worksheet.eachRow({ includeEmpty: true }, function(row, rowNumber) {
            if (rowNumber >= 5){ //comienzo a tomar datos desde la linea 5 inclusive
              if (row.values[4]){              
                var c = row.values[4]; //recupero el codigo
                var s = parseInt(row.values[6]); //recupero el stock        
                arr_prod.push({codigo:c, stock:s});
              }              
            }                      
          });
      }); 
      this._productoService.actualizar_stock_producto_admin(arr_prod,this.token).subscribe(                  
        response=>{ this.init_data(); },
        error=>{ console.log(error) }
      );

      // arr_prod.forEach((item) => {
      //   var data = { codigo : item.codigo, precio : parseFloat(item.precio)};
      // });
    }

  }
  

}
