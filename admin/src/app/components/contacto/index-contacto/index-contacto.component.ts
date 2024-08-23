import { Component } from '@angular/core';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { AdminService } from '../../../service/admin.service';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';


declare var jQuery:any
declare var $:any
declare var iziToast:any;

@Component({
  selector: 'app-index-contacto',
  standalone: true,
  imports: [SidebarComponent,NgbPaginationModule,RouterModule,CommonModule],
  templateUrl: './index-contacto.component.html',
  styleUrl: './index-contacto.component.css'
})
export class IndexContactoComponent {

  public mensajes :Array<any>=[]
  public load_data=true
  public page=1
  public pageSize=20
  public filtro=''
  public token:any
  public load_btn=false

  constructor(
    private _adminService:AdminService
  ){

    this.token=localStorage.getItem('token')
  }


  ngOnInit(): void {
    this.init_data()
  }
  
  init_data(){
    this._adminService.obtener_mensajes_admin(this.token).subscribe(
      response=>{
        this.mensajes=response.data
        this.load_data=false
      }
    )
  }


  cerrar(id:any){
    this.load_btn=true
    this._adminService.cerrar_mensaje_admin(id,{data:undefined},this.token).subscribe(
      response=>{
        iziToast.show({
          title:'¡Asunto Cerrado!',
          titleColor:'#00CF61',
          class:'text-success',
          position:'topRight',
          message:'¡Seguimos avanzando! 🚀'
        })
        $('#estadoModal-'+id).modal('hide')
        $('.modal-backdrop').removeClass('show')
        this.init_data()
        this.load_btn=false
      },
      error=>{console.log(error)}
    )

  }

}
