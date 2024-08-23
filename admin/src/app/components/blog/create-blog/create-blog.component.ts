import { Component } from '@angular/core';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { FormsModule, FormGroup, FormControl,Validators} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../service/admin.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {TinymceComponent } from 'ngx-tinymce';

declare var iziToast:any;
declare var $:any;

@Component({
  selector: 'app-create-blog',
  standalone: true,
  imports: [SidebarComponent,FormsModule,CommonModule,TinymceComponent, RouterModule],
  templateUrl: './create-blog.component.html',
  styleUrl: './create-blog.component.css'
})
export class CreateBlogComponent {


  public config:any={}
  public configCorta:any={}
  public imgSelect : any | ArrayBuffer = 'assets/img/components/noimagen/noimg.PNG';
  public file : any = undefined;
  public load_btn = false;
  public token = localStorage.getItem('token');
  
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
  
  blogForm!:FormGroup
  
  constructor(
    private _adminService:AdminService,
  private _route:ActivatedRoute,
  private _router:Router,
  ){
  
    this.config={
      height:400  ,
      license_key: 'gpl'
    }

    
    this.configCorta={
      height:200  ,
      license_key: 'gpl'
    }

    this.blogForm=new FormGroup({
      titulo: new FormControl(this.blog.titulo, [
        Validators.required,
        Validators.minLength(4),
        //forbiddenNameValidator(/bob/i), // <-- Here's how you pass in the custom validator.
      ]),

      contenido: new FormControl(this.blog.contenido, [
        Validators.required,
      ]),
      descripcion: new FormControl(this.blog.contenido, [
        Validators.required,
      ]),
      categoria: new FormControl(this.blog.categoria, Validators.required),
      etiquetas: new FormControl(this.blog.etiquetas, Validators.required),
  
    })
  
  }

  ngOnInit(): void {
    this._adminService.get_categorias(this.token).subscribe(
      response=>{
        this.categorias = response.data;
      }
    );
  
    this._adminService.listar_etiquetas_post_global_admin(this.token).subscribe(
      response=>{
        this.etiquetas = response.data;
        console.log('ETIQUETAS',response);
  
      }
    );
  }
  

registro(blogForm:any){
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

}
