import { Component } from '@angular/core';
import { AdminService } from '../../../service/admin.service';
import { SidebarComponent } from "../../sidebar/sidebar.component";
import { CommonModule } from '@angular/common';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Banner } from '../../../interfaces/banner';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

declare var jQuery: any;
declare var iziToast: { show: (arg0: { title: string; titleColor: string; class: string; position: string; message: string; }) => void; };
declare var $: any;

@Component({
  selector: 'app-config-general',
  standalone: true,
  imports: [SidebarComponent, CommonModule, NgbPaginationModule, FormsModule,NgbAccordionModule],
  templateUrl: './config-general.component.html',
  styleUrl: './config-general.component.css'
})
export class ConfigGeneralComponent {
  public categorias: Array<any> = []
  public token = localStorage.getItem('token')
  public page = 1;
  public pageSize = 24;
  public load = true;
  public titulo = ''
  public load_btn = false

  public imgSelect: any | ArrayBuffer = 'assets/img/components/noimagen/noimg.PNG';
  public file: any = undefined

  public imagen = {
    titulo: '',
    subtitulo: '',
    enlace: '',
    imagen:'',
    tituloBoton: '',
  }
  public banner = {
    titulo: '',
  }

  public banners: Array<any> = [
  ]
  public id_banner=''
  
  public Banner: Banner = {
    titulo: '',
  _id:'',
    galeria: [
    ],
  };


  selectedImage: any = null;

openEditModal(imagen: any) {
  this.selectedImage = imagen;
  this.imgSelect = this.selectedImage.imagen;
  console.log(this.selectedImage)
}


  constructor(
    private _adminService:AdminService,
    private _router:Router
  ){
    this.initData()

  }

  initData() {
    this.load = true
    this._adminService.obtener_banner_admin(this.token).subscribe(
      response => {
        this.banners = response.data;
this.id_banner=response.data[0]._id
        console.log('Banners',this.banners)
        this.load = false
      }
    );
  }

  crearNuevoBanner(bannerForm:any){

    if (bannerForm.valid) {
      
        this.load_btn = true;
        this._adminService.crear_banner_admin(this.banner,this.token).subscribe(
          response => {
  
            if (response.data == undefined) {
              iziToast.show({
                title: 'ERROR',
                titleColor: '#FF0000',
                class: 'text-danger',
                position: 'topRight',
                message: response.message
              });
              this.load_btn = false;
            } else {
              iziToast.show({
                title: 'SUCCESS',
                titleColor: '#1DC74C',
                class: 'text-success',
                position: 'topRight',
                message: 'Se registro correctamente el Nuevo Banner.'
              });
              this.load_btn = false;
  
              //this.initData()
              $('#anadirBanner').modal('hide');
              $('.modal-backdrop').remove();
            }
          },
          error => {
            this.load_btn = false;
          }
        );

        this.load_btn = false;
      
    }
    else {
      iziToast.show({
        title: '¡Ups!',
        titleColor: 'red',
        class: 'text-danger',
        position: 'topRight',
        message: '🤔 Aún faltan detalles por completar, No olvides completar todas las características antes de guardar tu trabajo.'
      })
    }

  }

guardarNuevaImagen(imagenForm:any){
  if (imagenForm.valid) {
    if (this.file == undefined) {
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FF0000',
        class: 'text-danger',
        position: 'topRight',
        message: 'Debe subir una Imagen'
      });
      $('#input-portada').text('Seleccionar imagen');
      this.imgSelect = 'assets/img/components/noimagen/noimg.PNG';
      this.file = undefined;
    } else {
      this.load_btn = true;
      console.log('Enviando',this.id_banner)
      this._adminService.registro_imagen_banner_admin(this.imagen, this.id_banner, this.file, this.token).subscribe(
        response => {

          if (response.data == undefined) {
            iziToast.show({
              title: 'ERROR',
              titleColor: '#FF0000',
              class: 'text-danger',
              position: 'topRight',
              message: response.message
            });
            this.load_btn = false;
          } else {
            iziToast.show({
              title: 'SUCCESS',
              titleColor: '#1DC74C',
              class: 'text-success',
              position: 'topRight',
              message: 'Se registro correctamente la nueva Imagen.'
            });
            this.load_btn = false;

            //this.initData()
            $('#anadirCategoria').modal('hide');
            $('.modal-backdrop').remove();
            this.initData()
          }
        },
        error => {
          this.load_btn = false;
        }
      );

      this.load_btn = false;
    }

  }
  else {
    iziToast.show({
      title: '¡Ups!',
      titleColor: 'red',
      class: 'text-danger',
      position: 'topRight',
      message: '🤔 Aún faltan detalles por completar, No olvides completar todas las características antes de guardar tu trabajo.'
    })
  }
}

actualizarItemBanner(itemBannerForm:any){
if(itemBannerForm.valid){
var data: any = {};

      if (this.file != undefined) {
        data.imagen = this.file;
      }
      const id_imagen=this.selectedImage._id
      const id_banner=this.banners[0]._id

      data.titulo = this.selectedImage.titulo;
      data.subtitulo = this.selectedImage.subtitulo;
      data.tituloBoton = this.selectedImage.tituloBoton;
      data.enlace = this.selectedImage.enlace;

      this.load_btn = true;

      console.log('idss',id_banner,id_imagen)
      this._adminService.actualizar_item_banner_admin(data, id_imagen, id_banner, this.token).subscribe(
        response => {
          iziToast.show({
            title: 'SUCCESS',
            titleColor: '#1DC74C',
            class: 'text-success',
            position: 'topRight',
            message: 'Se actualizó correctamente el Item.'
          });

          this.load_btn = false;
          $('#editModal').modal('hide');
          $('.modal-backdrop').remove();
          this.initData()
          //this._router.navigate(['config/general']);
        },
        error => {
          this.load_btn = false;
        }
      )


    }else{
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FF0000',
        class: 'text-danger',
        position: 'topRight',
        message: 'Los datos del formulario no son validos'
      });
      this.load_btn = false;
    }
}

EliminarItemBanner(imagen:any){
const id_banner=this.banners[0]._id

this._adminService.eliminar_item_banner_admin(id_banner,imagen,this.token).subscribe(
  response=>{
    iziToast.show({
      title: 'SUCCESS',
      titleColor: '#1DC74C',
      class: 'text-success',
      position: 'topRight',
      message: 'Se Elimino el Item Correctamente.'
    });
    this.initData()
  }
)

}

fileChangeEvent(event: any): void {
  var file: any;
  if (event.target.files && event.target.files[0]) {
    file = <File>event.target.files[0];
  } else {
    iziToast.show({
      title: 'ERROR',
      titleColor: '#FF0000',
      //color: '#FFF',
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
        //color: '#FFF',
        class: 'text-danger',
        position: 'topRight',
        message: 'El archivo debe ser una imagen'
      });
      $('#input-portada').text('Seleccionar imagen');
      this.imgSelect = 'assets/img/components/noimagen/noimg.PNG';
      this.file = undefined;
    }
  } else {
    iziToast.show({
      title: 'ERROR',
      titleColor: '#FF0000',
      //color: '#FFF',
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
