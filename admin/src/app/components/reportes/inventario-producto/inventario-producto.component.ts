import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../../service/admin.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import * as XLSX from 'xlsx'

@Component({
  selector: 'app-inventario-producto',
  standalone: true,
  imports: [SidebarComponent,RouterModule,CommonModule,FormsModule],
  templateUrl: './inventario-producto.component.html',
  styleUrl: './inventario-producto.component.css'
})
export class InventarioProductoComponent implements OnInit {

public load=false
public load_categorias=false
public token=localStorage.getItem('token')
public inventario:Array<any>=[]
public inventario_const:Array<any>=[]
public categorias:Array<any>=[]

public filtro_categoria_producto=''

constructor(
  private _adminService:AdminService,
){



}

ngOnInit(): void {
  
  this.load = true;
    this._adminService.inventario_productos_admin(this.token).subscribe(
      response=>{
        this.inventario_const=response.data
        //this.inventario= response.data;
        this.inventario= this.inventario_const;
        this.load = false;
        this.initData()
      }
    );

}


initData(){
this.load_categorias=true
  this._adminService.get_categorias(this.token).subscribe(
    response=>{
      this.categorias= response.data;
      console.log('Respuesta Categorias',response.data)
      //console.log(this.inventario)
      this.load_categorias = false;
    }
  );


}

buscar_por_categoria(){

if(this.filtro_categoria_producto=='Todos'){

  this._adminService.inventario_productos_admin(this.token).subscribe(
    response=>{
      this.inventario_const=response.data
      this.inventario= this.inventario_const;
      this.load = false;
    }
  );

}else{

  if(this.filtro_categoria_producto){
    var term = new RegExp(this.filtro_categoria_producto.toString().trim() , 'i');
    this.inventario = this.inventario_const.filter(item=>term.test(item.categoria)||term.test(item._id));
  }

}

}

descargarReporte(){

  const datoss = [
    { nombre: 'Producto 1', precio: 100, cantidad: 2 },
    { nombre: 'Producto 2', precio: 200, cantidad: 5 }
  ];

  const datos=this.inventario

  const hoja = XLSX.utils.json_to_sheet(datos);
  const libro = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(libro, hoja, 'Reporte');

  XLSX.writeFile(libro, 'reporte.xlsx');


}


}
