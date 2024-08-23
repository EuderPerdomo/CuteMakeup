import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { AdminService } from '../../../service/admin.service';
import { ActivatedRoute, Route, Router, RouterModule } from '@angular/router';
import { FormGroup, Validators, FormControl, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {TinymceComponent } from 'ngx-tinymce';

declare var iziToast:any;
declare var $:any;

@Component({
  selector: 'app-create-producto',
  standalone: true,
  imports: [SidebarComponent,CommonModule,RouterModule,FormsModule,TinymceComponent],
  templateUrl: './create-producto.component.html',
  styleUrl: './create-producto.component.css'
})
export class CreateProductoComponent implements OnInit{

public config:any={}
public imgSelect : any | ArrayBuffer = 'assets/img/components/noimagen/noimg.PNG';
public file : any = undefined;
public load_btn = false;
public token = localStorage.getItem('token');

public categorias: Array<any> = [];
public etiquetas : Array<any> = [];
public arr_etiquetas: Array<any> = [];
public new_etiqueta = '';

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
  };

productoForm!:FormGroup

constructor(
  private _adminService:AdminService,
private _route:ActivatedRoute,
private _router:Router
){

  this.config={
    height:400  ,
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
    response=>{
      this.categorias = response.data;
    }
  );

  this._adminService.listar_etiquetas_producto_global_admin(this.token).subscribe(
    response=>{
      this.etiquetas = response.data;
      console.log('ETIQUETAS',response);

    }
  );
}

fileChangeEvent(event:any):void{
  var file :any;
  if(event.target.files && event.target.files[0]){
    file = <File>event.target.files[0];
  }else{
    iziToast.show({
        title: 'ERROR',
        titleColor: '#FF0000',
        color: '#FFF',
        class: 'text-danger',
        position: 'topRight',
        message: 'No hay un imagen de envio'
    });
  }

  if(file.size <= 4000000){

    if(file.type == 'image/png' || file.type == 'image/webp' || file.type == 'image/jpg' || file.type == 'image/gif' || file.type == 'image/jpeg'){
  
      const reader = new FileReader();
      reader.onload = e => this.imgSelect = reader.result;
      console.log(this.imgSelect);
      
      reader.readAsDataURL(file);

      $('#input-portada').text(file.name);
      this.file = file;

    }else{
      iziToast.show({
          title: 'ERROR',
          titleColor: '#FF0000',
          color: '#FFF',
          class: 'text-danger',
          position: 'topRight',
          message: 'El archivo debe ser una imagen'
      });
      $('#input-portada').text('Seleccionar imagen');
      this.imgSelect = 'assets/img/components/noimagen/noimg.PNG';
      this.file = undefined;
    }
  }else{
    iziToast.show({
        title: 'ERROR',
        titleColor: '#FF0000',
        color: '#FFF',
        class: 'text-danger',
        position: 'topRight',
        message: 'La imagen no puede superar los 4MB'
    });
    $('#input-portada').text('Seleccionar imagen');
    this.imgSelect = 'assets/img/components/noimagen/noimg.PNG';
    this.file = undefined;
  }
  
  console.log(this.file);
  
}

registro(registroForm:any){
  if(registroForm.valid){
    if(this.file == undefined){
      iziToast.show({
        title: 'ERROR',
          titleColor: '#FF0000',
          color: '#FFF',
          class: 'text-danger',
          position: 'topRight',
          message: 'Debe subir una portada para registrar'
      });
      $('#input-portada').text('Seleccionar imagen');
      this.imgSelect = 'assets/img/components/noimagen/noimg.PNG';
      this.file = undefined;
    }else{
      this.load_btn = true;
      this.producto.etiquetas = this.arr_etiquetas;
console.log('Producto',this.producto)
      this._adminService.registro_producto_admin(this.producto,this.file,this.token).subscribe(
        response=>{

          if(response.data == undefined){
            iziToast.show({
                title: 'ERROR',
                titleColor: '#FF0000',
                color: '#FFF',
                class: 'text-danger',
                position: 'topRight',
                message: response.message
            });
            this.load_btn = false;
          }else{
            iziToast.show({
                title: 'SUCCESS',
                titleColor: '#1DC74C',
                color: '#FFF',
                class: 'text-success',
                position: 'topRight',
                message: 'Se registro correctamente el nuevo producto.'
            });
            this.load_btn = false;

            this._router.navigate(['panel/productos']);
          }
        },
        error=>{
          this.load_btn = false;
        }
      );

      this.load_btn = false;
    }
    
  }else{

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
  
agregar_etiqueta(){
  let arr_label = this.new_etiqueta.split('_');

  this.arr_etiquetas.push({
    etiqueta: arr_label[0],
    titulo: arr_label[1]
  });
  this.new_etiqueta = '';
}

eliminar_etiqueta(idx:any){
  this.arr_etiquetas.splice(idx,1)
}

}
