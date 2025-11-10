import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from "@auth0/angular-jwt";
import { AdminService } from 'src/app/services/admin.service';
import { GLOBAL } from 'src/app/services/GLOBAL';
var moment = require('moment');


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  public config: any = null;
  public url: string;
  public logo: string = 'assets/img/components/logo/logo.png'; // Logo por defecto

  constructor(
    private _router : Router,
    private _adminService: AdminService
  ) { 
    this.url = GLOBAL.url;
  }

  ngOnInit(): void {
    const token = localStorage.getItem('token')||'{}';   
    const helper = new JwtHelperService();
    var decodedToken = helper.decodeToken(token);
    
    const now = moment().unix();       
    
    if (now > decodedToken.exp) {      
      localStorage.removeItem('token');
      localStorage.removeItem('_id');
      return null
    }
    
    // Cargar configuración para obtener el logo
    this.cargarLogo();
  } 

  cargarLogo() {
    const token = localStorage.getItem('token');
    if (token) {
      this._adminService.obtener_config_admin(token).subscribe(
        response => {
          if (response.data && response.data.logo_dark) {
            this.logo = this.url + 'obtener_logo_dark/' + response.data.logo_dark;
          }
        },
        error => {
          console.log('Error al cargar logo:', error);
        }
      );
    }
  }

  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('_id');
    this._router.navigate(['/login']);
  }

}
