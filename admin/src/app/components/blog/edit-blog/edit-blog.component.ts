import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { AdminService } from '../../../service/admin.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TinymceComponent } from 'ngx-tinymce';

declare var iziToast:any;
declare var $:any;


@Component({
  selector: 'app-edit-blog',
  standalone: true,
  imports: [SidebarComponent,FormsModule,CommonModule,TinymceComponent,RouterModule],
  templateUrl: './edit-blog.component.html',
  styleUrl: './edit-blog.component.css'
})
export class EditBlogComponent implements OnInit {
  public id = '';
  public load_data = false;
  public token = localStorage.getItem('token');
  public file : any = undefined;
  public config:any={}
  public configCorta:any={}

  public categorias: Array<any> = [];
  public etiquetas : Array<any> = [];
  public arr_etiquetas: Array<any> = [];
  public new_etiqueta = '';
  
    public blog = {
      titulo: '',
        portada: '',
         contenido: '',
         descripcion: '',
          categoria:this.categorias[0], 
          etiquetas:this.etiquetas[0],
          fecha:'',
          autor:'',
    };

    public load_btn = false;

  blogForm!:FormGroup

  public imgSelect: any | ArrayBuffer = 'assets/img/components/noimagen/noimg.PNG';

constructor(
  private _adminService:AdminService,
  private _router:Router,
  private _route:ActivatedRoute,
){
  this.config={
    height:400  ,
    license_key: 'gpl'
  }

}
  
  ngOnInit(): void {
    this._route.params.subscribe(
      params => {
        this.id = params['id'];
        console.log(this.id);
        this.load_data = true;
        this._adminService.obtener_blog_admin(this.id, this.token).subscribe(
          response => {
            if (response.data == undefined) {
              this.load_data = false;
              //this.producto = undefined;

            } else {
              this.load_data = false;
              this.blog = response.data;
              console.log('Blog Obtenido',this.blog)
              //this.listar_etiquetas();
              //this.listar_etiquetas_producto();
              //this.imgSelect = this.url +'obtener_portada/'+this.producto.portada;
             this.imgSelect = this.blog.portada;
            }

          },
          error => {
            console.log(error);

          }
        );

      }
    );
  }


  EditarPost(blogForm:any){
    if(blogForm.valid){
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
        this.blog.etiquetas = this.arr_etiquetas;
  console.log('Producto',this.blog)
        this._adminService.registro_blog_admin(this.blog,this.file,this.token).subscribe(
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
                  message: 'Se registro correctamente el nuevo Blog.'
              });
              this.load_btn = false;
  
              this._router.navigate(['panel/blog']);
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
