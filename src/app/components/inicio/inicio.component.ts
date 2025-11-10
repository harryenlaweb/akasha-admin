import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import Chart  from 'chart.js/auto';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  public token;

  constructor(
    private _adminService:AdminService,
  ) { 
    this.token = localStorage.getItem('token');
  }

  ngOnInit(): void {
    this.init_data();

}

  init_data(){
    this._adminService.kpi_ganancias_mensuales_admin(this.token).subscribe(
      response=>{
    
          // var canvas = <HTMLCanvasElement> document.getElementById('myChart');
          // const ctx = canvas.getContext('2d');
          // const myChart = new Chart(ctx, {
          //   type: 'bar',
          //   data: {
          //       labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
          //       datasets: [{
          //           label: 'Meses',
          //           data: [ response.enero, response.febrero, response.marzo, response.abril, response.mayo, response.junio, response.julio, 
          //                   response.agosto, response.septiembre, response.octubre, response.noviembre, response.diciembre],
          //           backgroundColor: [
          //               'rgba(255, 99, 132, 0.2)',
          //               'rgba(54, 162, 235, 0.2)',
          //               'rgba(255, 206, 86, 0.2)',
          //               'rgba(75, 192, 192, 0.2)',
          //               'rgba(153, 102, 255, 0.2)',
          //               'rgba(255, 159, 64, 0.2)',
          //               'rgba(255, 159, 64, 0.2)',
          //               'rgba(255, 159, 64, 0.2)',
          //               'rgba(255, 159, 64, 0.2)',
          //               'rgba(255, 159, 64, 0.2)',
          //               'rgba(255, 159, 64, 0.2)',
          //               'rgba(255, 159, 64, 0.2)',
          //           ],
          //           borderColor: [
          //               'rgba(255, 99, 132, 1)',
          //               'rgba(54, 162, 235, 1)',
          //               'rgba(255, 206, 86, 1)',
          //               'rgba(75, 192, 192, 1)',
          //               'rgba(153, 102, 255, 1)',
          //               'rgba(255, 159, 64, 1)',
          //               'rgba(255, 159, 64, 1)',
          //               'rgba(255, 159, 64, 1)',
          //               'rgba(255, 159, 64, 1)',
          //               'rgba(255, 159, 64, 1)',
          //               'rgba(255, 159, 64, 1)',
          //               'rgba(255, 159, 64, 1)',
          //           ],
          //           borderWidth: 1
          //       }]
          //   },
          //   options: {
          //       scales: {
          //           y: {
          //               beginAtZero: true
          //           }
          //       }
          //   }
          // });
        
      }
    )
  }

}
