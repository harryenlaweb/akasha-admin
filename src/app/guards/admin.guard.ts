import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Route, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AdminService } from "src/app/services/admin.service";
import { Router } from "@angular/router";

declare var iziToast: any;

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private _adminService:AdminService,
    private _router:Router
  ){
    
  }
 
  canActivate(route: ActivatedRouteSnapshot):any{
    // Verificar si está autenticado
    if(!this._adminService.isAuthenticated(['admin', 'operador'])){
      this._router.navigate(['/login']);
      return false; 
    }

    // Verificar rol específico si la ruta lo requiere
    const requiredRole = route.data['role'];
    if (requiredRole) {
      const identity = this._adminService.getIdentity();
      if (identity && identity.rol !== requiredRole) {
        iziToast.error({
          title: 'ERROR',
          titleColor: '#FF0000',
          color: '#FFF',
          class: 'text-danger',
          position: 'topRight',
          message: 'No tienes permisos para acceder a esta sección'
        });
        this._router.navigate(['/panel']);
        return false;
      }
    }

    return true;
  }
}
