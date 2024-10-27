import { Component } from '@angular/core';
import { AdminService } from '../../../service/admin.service';
import { SidebarComponent } from "../../sidebar/sidebar.component";
import { CommonModule } from '@angular/common';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

declare var jQuery: any;
declare var iziToast: { show: (arg0: { title: string; titleColor: string; class: string; position: string; message: string; }) => void; };
declare var $: any;

@Component({
  selector: 'app-categoria-producto',
  standalone: true,
  imports: [SidebarComponent, CommonModule, NgbPaginationModule, FormsModule],
  templateUrl: './categoria-producto.component.html',
  styleUrl: './categoria-producto.component.css'
})
export class CategoriaProductoComponent {
  public categorias: Array<any> = []
  public token = localStorage.getItem('token')
  public page = 1;
  public pageSize = 24;
  public load = false;
  public titulo = ''
  public load_btn = false

  public imgSelect: any | ArrayBuffer = 'assets/img/components/noimagen/noimg.PNG';
  public file: any = undefined

  public categoria = {
    titulo: '',

  }

  constructor(
    private _adminService: AdminService,
    private _router: Router
  ) {
    this.initData()

  }

  initData() {
    this.load = true
    this._adminService.get_categorias(this.token).subscribe(
      response => {
        this.categorias = response.data;
        this.load = false
      }
    );
  }

  guardarNuevaCategoria(registro: any) {

    if (registro.valid) {
      if (this.file == undefined) {
        iziToast.show({
          title: 'ERROR',
          titleColor: '#FF0000',
          class: 'text-danger',
          position: 'topRight',
          message: 'Debe subir una portada para registrar'
        });
        $('#input-portada').text('Seleccionar imagen');
        this.imgSelect = 'assets/img/components/noimagen/noimg.PNG';
        this.file = undefined;
      } else {
        this.load_btn = true;
        this._adminService.registro_categoria_admin(this.categoria, this.file, this.token).subscribe(
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
                message: 'Se registro correctamente la nueva categoria.'
              });
              this.load_btn = false;

              this.initData()
              $('#anadirCategoria').modal('hide');
              $('.modal-backdrop').remove();
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
  }



}
