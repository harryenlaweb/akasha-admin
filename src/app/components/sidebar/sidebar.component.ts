import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from "@auth0/angular-jwt";
import { AdminService } from 'src/app/services/admin.service';
import { GLOBAL } from 'src/app/services/GLOBAL';
var moment = require('moment');

declare var $: any;

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
    
    // Inicializar el offcanvas manualmente
    setTimeout(() => {
      this.initOffcanvas();
    }, 100);
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

  initOffcanvas() {
    // Inicializar offcanvas con jQuery
    const toggleBtn = document.querySelector('[data-toggle="offcanvas"]');
    const offcanvas = document.getElementById('componentsNav');
    const closeBtn = document.querySelector('[data-dismiss="offcanvas"]');
    
    if (toggleBtn && offcanvas) {
      toggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        offcanvas.classList.add('show');
        document.body.classList.add('offcanvas-enabled');
      });
      
      if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
          e.preventDefault();
          offcanvas.classList.remove('show');
          document.body.classList.remove('offcanvas-enabled');
        });
      }
      
      // Cerrar al hacer click en el backdrop
      document.addEventListener('click', (e: any) => {
        if (e.target.classList.contains('offcanvas-enabled')) {
          offcanvas.classList.remove('show');
          document.body.classList.remove('offcanvas-enabled');
        }
      });
    }
  }

}
