import { Component } from '@angular/core';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from '../../../service/admin.service';
import { GLOBAL } from '../../../service/GLOBAL';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

declare var iziToast: { show: (arg0: { title: string; titleColor: string; class: string; position: string; message: string; }) => void; };
declare var jQuery:any
declare var $:any



@Component({
  selector: 'app-galeria-producto',
  standalone: true,
  imports: [SidebarComponent,FormsModule,CommonModule],
  templateUrl: './galeria-producto.component.html',
  styleUrl: './galeria-producto.component.css'
})
export class GaleriaProductoComponent {

  public producto: any = {}
  public id: any
  public token: any
  public file:File = undefined!
  public load_btn=false
  public url:any
  public load_btn_eliminar=false

  public imgSelect: any | ArrayBuffer = 'assets/img/components/noimagen/noimg.PNG';

  constructor(
    private _route:ActivatedRoute,
    private _adminService: AdminService,

  ) {
    this.token = localStorage.getItem('token')
    this.url=GLOBAL.url

    this._route.params.subscribe(
      params => {
        this.id = params['id']
        console.log(this.id)
       this.init_data()
      }


    )
  }

  init_data(){
    this._adminService.obtener_producto_admin(this.id, this.token).subscribe(
      response => {
        if (response.data == undefined) {
          this.producto = undefined
        } else {
          this.producto = response.data

        }
        console.log(this.producto)
      },
      error => { console.log(error) }
    )
  }
  
  fileChangeEvent(event: any): void {
    var file:any
    if (event.target.files && event.target.files[0]) {
      file = <File>event.target.files[0]
    } else {
      iziToast.show({
        title: 'Error',
        titleColor: 'red',
        class: 'text-danger',
        position: 'topRight',
        message: 'No hay una imagen'
      })
      

     // this.file=undefined!
    }

    if(file.size <= 4000000){
      if(file.type=='image/png' || file.type=='image/webp' || file.type=='image/jpg' || file.type=='image/gif' || file.type=='image/jpeg'){
      const reader = new FileReader()
      this.file =file
      }else{
        iziToast.show({
          title: 'Error',
          titleColor: 'red',
          class: 'text-danger',
          position: 'topRight',
          message: 'Formato de imagen o archivo invalido'          
        })
        $('#input_img').val('')
        this.file=undefined!
      }
    }else{
      iziToast.show({
        title: 'Error',
        titleColor: 'red',
        class: 'text-danger',
        position: 'topRight',
        message: 'La imagen no puede superar los 4MB'
      })
      $('#input_img').val('')
      this.file=undefined!
    }
  console.log(this.file)
  }

  subir_imagen(){}

  eliminar(id:any){

  }

  
}
