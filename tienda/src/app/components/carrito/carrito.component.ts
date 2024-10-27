import { Component, ChangeDetectorRef } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { NavComponent } from '../nav/nav.component';
import { ClienteService } from '../../service/cliente.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { io } from 'socket.io-client'

declare var $: any
declare var tns: any
declare var iziToast: { show: (arg0: { title: string; class: string; titleColor: string; position: string; message: string; }) => void; };

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [FooterComponent, NavComponent, CommonModule, RouterModule],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent {

  public socket = io('http://localhost:4201')

  public token: any
  public id_cliente: any
  public carrito_arr: Array<any> = []
  public subtotal = 0
  public total_pagar = 0


  constructor(
    private cdr: ChangeDetectorRef,
    private _clienteService: ClienteService
  ) {
    this.token = localStorage.getItem('token')

if(this.token){
  this.id_cliente = localStorage.getItem('identity')
}
else{
  this.id_cliente=localStorage.getItem('cartID')
}

    

this.obtener_carrito_cliente()

  }
  obtener_carrito_cliente() {
    this._clienteService.obtener_carrito_cliente(this.id_cliente, this.token).subscribe(
      response => {
        this.carrito_arr = response.data

        //Consultar nombre de la variedad y Nombre de la subvariedad para mostrar en el carrito

        this.carrito_arr.forEach(item => {
          const selectedVariety = item.producto.variedades.find((v: { _id: any; }) => v._id === item.variedad);

          if (selectedVariety) {
            item.nombre_variedad = selectedVariety.titulo;

            const selectedSubvariety = selectedVariety.tamano_disponibilidad.find((sub: { _id: any; }) => sub._id === item.subvariedad);

            if (selectedSubvariety) {
              item.nombre_subvariedad = `${selectedSubvariety.tamano} ${selectedSubvariety.unidad_medida}`;
            }
          }
        });

console.log('Carro en chekout',this.carrito_arr)
        this.calcular_carrito()
      }
      //Acomodar datos de acuerdo a la variedad
    )
  }


  calcular_carrito() {
    this.subtotal=0
    this.carrito_arr.forEach(element => {
      this.subtotal = this.subtotal + parseInt(element.precio)*parseInt(element.cantidad)
    }
    )
    this.total_pagar = this.subtotal
  }

  eliminar_item(item_id: any) {
    this._clienteService.eliminar_carrito_cliente(item_id, this.token).subscribe(
      response => {

        iziToast.show({
          title: '¡Puff! Producto eliminado',
          titleColor: '#FF0000',
          class: 'text-danger',
          position: 'topRight',
          message: '🎉 ¡Ahora hay más espacio para nuevas aventuras de compra! 🛒🌟'

        });

        this.socket.emit('delete-carrito', { data: response.data })


        this._clienteService.obtener_carrito_cliente(this.id_cliente, this.token).subscribe(
          response => {
            this.carrito_arr = response.data
            console.log(this.carrito_arr)
            this.calcular_carrito()
          }
          //Acomodar datos de acuerdo a la variedad
        )


      }
    )
  }



}
