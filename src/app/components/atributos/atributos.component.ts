import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { v4 as uuidv4 } from 'uuid';

declare var iziToast: any;
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-atributos',
  templateUrl: './atributos.component.html',
  styleUrls: ['./atributos.component.css']
})
export class AtributosComponent implements OnInit {

  public token;
  public config: any = null;
  public load_btn = false;
  public load_data = true;

  // Variables para cada tipo de atributo
  public titulo_categoria_principal = '';
  public titulo_subcategoria = '';
  public titulo_color = '';
  public titulo_talle = '';
  public titulo_marca = '';
  public titulo_temporada = '';

  // Variables para gestión de subcategorías anidadas
  public categoria_seleccionada: any = null;
  public categoria_seleccionada_index: number = -1;
  public categoria_expandida: number = -1; // Para controlar qué categoría está expandida

  constructor(
    private _adminService: AdminService,
    private cdr: ChangeDetectorRef
  ) {
    this.token = localStorage.getItem('token');
  }

  ngOnInit(): void {
    this.init_data();
  }

  init_data() {
    this.load_data = true;
    this._adminService.obtener_config_admin(this.token).subscribe(
      response => {
        if(response.data) {
          this.config = response.data;
          
          // Inicializar arrays si no existen
          if(!this.config.categorias_principales) this.config.categorias_principales = [];
          if(!this.config.colores) this.config.colores = [];
          if(!this.config.talles) this.config.talles = [];
          if(!this.config.marcas) this.config.marcas = [];
          if(!this.config.temporadas) this.config.temporadas = [];
          
          // Asegurar que cada categoría principal tenga un array de subcategorías
          this.config.categorias_principales.forEach((cat: any) => {
            if(!cat.subcategorias) {
              cat.subcategorias = [];
            }
          });
        }
        this.load_data = false;
      },
      error => {
        console.log(error);
        this.load_data = false;
        iziToast.error({
          title: 'ERROR',
          message: 'Error al cargar la configuración'
        });
      }
    );
  }

  // ============ FUNCIONES PARA CATEGORÍAS PRINCIPALES ============
  agregar_categoria_principal() {
    if(this.titulo_categoria_principal) {
      this.config.categorias_principales.push({
        titulo: this.titulo_categoria_principal,
        _id: uuidv4(),
        subcategorias: []
      });
      this.actualizar_config_atributos();
      this.titulo_categoria_principal = '';
    } else {
      this.mostrar_error('Debe ingresar un título');
    }
  }

  eliminar_categoria_principal(indice: number) {
    this.config.categorias_principales.splice(indice, 1);
    this.actualizar_config_atributos();
  }

  // ============ FUNCIONES PARA SUBCATEGORÍAS ANIDADAS ============
  toggleCategoria(index: number) {
    if(this.categoria_expandida === index) {
      this.categoria_expandida = -1; // Colapsar si ya está expandida
      this.categoria_seleccionada = null;
      this.categoria_seleccionada_index = -1;
    } else {
      this.categoria_expandida = index; // Expandir esta categoría
      this.seleccionar_categoria(this.config.categorias_principales[index], index);
    }
    
    // Forzar detección de cambios
    this.cdr.detectChanges();
  }

  seleccionar_categoria(categoria: any, index: number) {
    this.categoria_seleccionada = categoria;
    this.categoria_seleccionada_index = index;
    this.titulo_subcategoria = '';
  }

  agregar_subcategoria_a_categoria() {
    if(!this.categoria_seleccionada) {
      this.mostrar_error('Debe seleccionar una categoría principal primero');
      return;
    }
    
    if(this.titulo_subcategoria) {
      if(!this.categoria_seleccionada.subcategorias) {
        this.categoria_seleccionada.subcategorias = [];
      }
      
      this.categoria_seleccionada.subcategorias.push({
        titulo: this.titulo_subcategoria,
        _id: uuidv4()
      });
      
      // Actualizar en el array principal
      this.config.categorias_principales[this.categoria_seleccionada_index] = this.categoria_seleccionada;
      
      this.actualizar_config_atributos();
      this.titulo_subcategoria = '';
    } else {
      this.mostrar_error('Debe ingresar un título para la subcategoría');
    }
  }

  eliminar_subcategoria_de_categoria(cat_index: number, sub_index: number) {
    this.config.categorias_principales[cat_index].subcategorias.splice(sub_index, 1);
    this.actualizar_config_atributos();
  }

  // ============ FUNCIONES PARA COLORES ============
  agregar_color() {
    if(this.titulo_color) {
      this.config.colores.push({
        titulo: this.titulo_color,
        _id: uuidv4()
      });
      this.actualizar_config_atributos();
      this.titulo_color = '';
    } else {
      this.mostrar_error('Debe ingresar un título');
    }
  }

  eliminar_color(indice: number) {
    this.config.colores.splice(indice, 1);
    this.actualizar_config_atributos();
  }

  // ============ FUNCIONES PARA TALLES ============
  agregar_talle() {
    if(this.titulo_talle) {
      this.config.talles.push({
        titulo: this.titulo_talle,
        _id: uuidv4()
      });
      this.actualizar_config_atributos();
      this.titulo_talle = '';
    } else {
      this.mostrar_error('Debe ingresar un título');
    }
  }

  eliminar_talle(indice: number) {
    this.config.talles.splice(indice, 1);
    this.actualizar_config_atributos();
  }

  // ============ FUNCIONES PARA MARCAS ============
  agregar_marca() {
    if(this.titulo_marca) {
      this.config.marcas.push({
        titulo: this.titulo_marca,
        _id: uuidv4()
      });
      this.actualizar_config_atributos();
      this.titulo_marca = '';
    } else {
      this.mostrar_error('Debe ingresar un título');
    }
  }

  eliminar_marca(indice: number) {
    this.config.marcas.splice(indice, 1);
    this.actualizar_config_atributos();
  }

  // ============ FUNCIONES PARA TEMPORADAS ============
  agregar_temporada() {
    if(this.titulo_temporada) {
      this.config.temporadas.push({
        titulo: this.titulo_temporada,
        _id: uuidv4()
      });
      this.actualizar_config_atributos();
      this.titulo_temporada = '';
    } else {
      this.mostrar_error('Debe ingresar un título');
    }
  }

  eliminar_temporada(indice: number) {
    this.config.temporadas.splice(indice, 1);
    this.actualizar_config_atributos();
  }

  // ============ FUNCIÓN AUXILIAR PARA ACTUALIZAR ============
  actualizar_config_atributos() {
    this.load_btn = true;
    
    let data = {
      categorias_principales: this.config.categorias_principales || [],
      colores: this.config.colores || [],
      talles: this.config.talles || [],
      marcas: this.config.marcas || [],
      temporadas: this.config.temporadas || []
    };

    console.log('Datos a enviar:', data);

    this._adminService.actualizar_config_admin("617489968545016143869a76", data, this.token).subscribe(
      response => {
        console.log('Respuesta del servidor:', response);
        iziToast.show({
          title: 'SUCCESS',
          titleColor: '#1DC74C',
          color: '#FFF',
          class: 'text-success',
          position: 'topRight',
          message: 'Se actualizó correctamente la configuración.'
        });
        this.load_btn = false;
        this.init_data();
      },
      error => {
        console.log('Error al actualizar:', error);
        this.mostrar_error('Error al actualizar');
        this.load_btn = false;
      }
    );
  }

  mostrar_error(mensaje: string) {
    iziToast.show({
      title: 'ERROR',
      titleColor: '#FF0000',
      color: '#FFF',
      class: 'text-danger',
      position: 'topRight',
      message: mensaje
    });
  }

}
