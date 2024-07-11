import { Component } from '@angular/core';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { AdminService } from '../../../service/admin.service';
import { RouterModule } from '@angular/router';
import { CommonModule, NgFor } from '@angular/common';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

declare var jQuery:any
declare var $:any
declare var iziToast:any;

@Component({
  selector: 'app-index-cliente',
  standalone: true,
  imports: [SidebarComponent,RouterModule,NgFor,CommonModule,NgbPaginationModule,FormsModule],
  templateUrl: './index-cliente.component.html',
  styleUrl: './index-cliente.component.css'
})
export class IndexClienteComponent {
  public token = localStorage.getItem('token');
  public clientes :Array<any>= [];
  public clientes_const  :Array<any>= [];
  public page = 1;
  public pageSize = 25;
  public filtro = '';
  public load_data=true

  constructor(
    private _adminService:AdminService
  ) { }

  ngOnInit(): void {
this.init_data()
  }

  init_data(){
    this._adminService.listar_clientes_admin(this.token).subscribe(
      response=>{
        this.clientes_const = response.data;
        this.clientes= this.clientes_const;
        this.load_data=false
      }
    );
  }

  filtrar_cliente(){
    if(this.filtro){
      var term = new RegExp(this.filtro.toString().trim() , 'i');
      this.clientes = this.clientes_const.filter(item=>term.test(item.nombres)||term.test(item.apellidos)||term.test(item.email)||term.test(item.dni)||term.test(item.telefono)||term.test(item._id));
    }else{
      this.clientes = this.clientes_const;
    }
  }


  eliminar(id:any){
    this._adminService.eliminar_cliente_admin(id,this.token).subscribe(
      response=>{
        iziToast.show({
            title: 'SUCCESS',
            titleColor: '#1DC74C',
            color: '#FFF',
            class: 'text-success',
            position: 'topRight',
            message: 'Se eliminó correctamente el cliente.'
        });

        $('#delete-'+id).modal('hide');
        $('.modal-backdrop').remove();

        this.init_data();
        
      },
      error=>{
        console.log(error);
        
      }
    )
  }

}
