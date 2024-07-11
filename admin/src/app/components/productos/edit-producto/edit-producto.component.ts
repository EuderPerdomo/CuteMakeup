import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { GLOBAL } from '../../../service/GLOBAL';
import { AdminService } from '../../../service/admin.service';
import { ActivatedRoute, Router, RouterModule ,Route} from '@angular/router';
import { FormGroup, FormsModule, FormControl,Validators } from '@angular/forms';
import { TinymceComponent } from 'ngx-tinymce';



import { CommonModule } from '@angular/common';


declare var iziToast: any;
declare var $: any;


@Component({
  selector: 'app-edit-producto',
  standalone: true,
  imports: [SidebarComponent,RouterModule,FormsModule,TinymceComponent,CommonModule],
  templateUrl: './edit-producto.component.html',
  styleUrl: './edit-producto.component.css'
})
export class EditProductoComponent implements OnInit {

 
  public id = '';
  public load_data = false;

  public categorias: Array<any> = [];
public etiquetas : Array<any> = [];

  public producto = {
    titulo: '',
     precio: '',
      descripcion: '',
       contenido: '',
        stock: '',
        categoria:this.categorias[0], 
        descripcion_corta: '',
        etiquetas:this.etiquetas[0],
        peso:0,
        portada:''
  };
  public imgSelect: any | ArrayBuffer = 'assets/img/components/noimagen/noimg.PNG';
  public config: any = {};
  public load_btn = false;
  public file: any = undefined;


  public arr_etiquetas: Array<any> = [];
  public token = localStorage.getItem('token');
  public new_etiqueta = '';
  public load_data_etiqueta = false;
  public load_etiquetas = false;
  public url = GLOBAL.url;

productoForm!:FormGroup

  constructor(
    private _adminService:AdminService,
    private _router:Router,
    private _route:ActivatedRoute
  ) {
    this.config = {
      height: 500,
       license_key: 'gpl'
    }

    this.productoForm=new FormGroup({
      titulo: new FormControl(this.producto.titulo, [
        Validators.required,
        Validators.minLength(4),
        //forbiddenNameValidator(/bob/i), // <-- Here's how you pass in the custom validator.
      ]),
  
      stock: new FormControl(this.producto.stock, [
        Validators.required,
        Validators.minLength(4),
        //forbiddenNameValidator(/bob/i), // <-- Here's how you pass in the custom validator.
      ]),
      precio: new FormControl(this.producto.precio, [
        Validators.required,
        Validators.minLength(4),
        //forbiddenNameValidator(/bob/i), // <-- Here's how you pass in the custom validator.
      ]),
      contenido: new FormControl(this.producto.contenido, [
        Validators.required,
      ]),
      categoria: new FormControl(this.producto.categoria, Validators.required),
      etiquetas: new FormControl(this.producto.etiquetas, Validators.required),
  
    })
  }

  ngOnInit(): void {

    this._adminService.get_categorias(this.token).subscribe(
      response => {
        this.categorias = response.data;
        console.log('categorias',this.categorias)
      }
    );

    this._route.params.subscribe(
      params => {
        this.id = params['id'];
        console.log(this.id);
        this.load_data = true;
        this._adminService.obtener_producto_admin(this.id, this.token).subscribe(
          response => {
            if (response.data == undefined) {
              this.load_data = false;
              //this.producto = undefined;

            } else {
              this.load_data = false;
              this.producto = response.data;
              console.log('producto Obtenido',this.producto)
              this.listar_etiquetas();
              this.listar_etiquetas_producto();
              //this.imgSelect = this.url +'obtener_portada/'+this.producto.portada;
             this.imgSelect = this.producto.portada;
            }

          },
          error => {
            console.log(error);

          }
        );

      }
    );
  }

  listar_etiquetas() {
    this.load_data_etiqueta = true;
    this._adminService.listar_etiquetas_admin(this.token).subscribe(
      response => {
        this.etiquetas = response.data;
        console.log(response);
        this.load_data_etiqueta = false;
      }
    );
  }

  listar_etiquetas_producto() {
    this.load_etiquetas = true;
    this._adminService.listar_etiquetas_producto_admin(this.id, this.token).subscribe(
      response => {
        this.arr_etiquetas = response.data;
        this.load_etiquetas = false;
        console.log('Etiquetas del Producto',this.arr_etiquetas)
      }
    );
  }


  fileChangeEvent(event: any): void {
    var file: any;
    if (event.target.files && event.target.files[0]) {
      file = <File>event.target.files[0];

    } else {
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FF0000',
        color: '#FFF',
        class: 'text-danger',
        position: 'topRight',
        message: 'No hay un imagen de envio'
      });
    }

    if (file.size <= 4000000) {

      if (file.type == 'image/png' || file.type == 'image/webp' || file.type == 'image/jpg' || file.type == 'image/gif' || file.type == 'image/jpeg') {

        const reader = new FileReader();
        reader.onload = e => this.imgSelect = reader.result;
        console.log(this.imgSelect);

        reader.readAsDataURL(file);

        $('#input-portada').text(file.name);
        this.file = file;

      } else {
        iziToast.show({
          title: 'ERROR',
          titleColor: '#FF0000',
          color: '#FFF',
          class: 'text-danger',
          position: 'topRight',
          message: 'El archivo debe ser una imagen'
        });
        $('#input-portada').text('Seleccionar imagen');
        this.imgSelect = 'assets/img/01.jpg';
        this.file = undefined;
      }
    } else {
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FF0000',
        color: '#FFF',
        class: 'text-danger',
        position: 'topRight',
        message: 'La imagen no puede superar los 4MB'
      });
      $('#input-portada').text('Seleccionar imagen');
      this.imgSelect = 'assets/img/01.jpg';
      this.file = undefined;
    }

    console.log(this.file);

  }

  eliminar_etiqueta(id: any) {
    console.log('id_elimianr',id)
    this.load_etiquetas = true;
    var idd=this.arr_etiquetas[id]._id
    console.log('elimianr',this.arr_etiquetas[id]._id)
    this._adminService.eliminar_etiqueta_producto_admin(idd, this.token).subscribe(
      response => {
        this.listar_etiquetas_producto();
        this.load_etiquetas = false;
      }
    );
  }

  agregar_etiqueta() {

    let data = {
      etiqueta: this.new_etiqueta,
      producto: this.id
    }
    console.log(data)
    this.load_etiquetas = true;
    this._adminService.agregar_etiqueta_producto_admin(data, this.token).subscribe(

      response => {
          this.listar_etiquetas_producto();
          this.load_etiquetas = false;


      },
      error=>{
console.log(error)
      }
    );
  }

  actualizar(actualizarForm: any) {
    if (actualizarForm.valid) {

      var data: any = {};

      if (this.file != undefined) {
        data.portada = this.file;
      }
/*
      if (!this.producto.precio_antes_soles || this.producto.precio_antes_soles == undefined) {
        this.producto.precio_antes_soles = 0;
      }

      if (!this.producto.precio_antes_dolares || this.producto.precio_antes_dolares == undefined) {
        this.producto.precio_antes_dolares = 0;
      }
        */

      data.titulo = this.producto.titulo;
      data.stock = this.producto.stock;
     // data.precio_antes_soles = this.producto.precio_antes_soles;
      //data.precio_antes_dolares = this.producto.precio_antes_dolares;
      data.precio = this.producto.precio;
      //data.precio_dolar = this.producto.precio_dolar;
      data.peso = this.producto.peso;
      //data.sku = this.producto.sku;
      data.categoria = this.producto.categoria;
      data.descripcion = this.producto.descripcion;
      data.contenido = this.producto.contenido;
      //data.visibilidad = this.producto.visibilidad;
      //data.tipo = this.producto.tipo;


      this.load_btn = true;

      this._adminService.actualizar_producto_admin(data, this.id, this.token).subscribe(
        response => {
          iziToast.show({
            title: 'SUCCESS',
            titleColor: '#1DC74C',
            color: '#FFF',
            class: 'text-success',
            position: 'topRight',
            message: 'Se actualizó correctamente el  producto.'
          });

          this.load_btn = false;

          this._router.navigate(['panel/productos']);
        },
        error => {
          this.load_btn = false;
        }
      )

    } else {
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FF0000',
        color: '#FFF',
        class: 'text-danger',
        position: 'topRight',
        message: 'Los datos del formulario no son validos'
      });
      this.load_btn = false;
    }
  }

}
