import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../../service/cliente.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Cliente } from '../../../app/cliente';

import {io} from 'socket.io-client'

declare var jQuery: any
declare var $: any
declare var iziToast: any;

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent implements OnInit {

  public token: any = '';
  public user_login: Cliente | undefined;

  public cliente = {
    email: '',
    password: ''
  }

  public categorias: Array<any> = [];

  //carrito de compras
  public op_cart = false
  public carrito_arr: Array<any> = []
  public subtotal=0
  public socket=io('http://localhost:4201')

  /*
    public user_login: Cliente = {
      apellidos: "",
      dni: '',
      email: '',
      fecha_nacimiento: '',
      genero: '',
      nombres: '',
      password: '',
      perfil: '',
      telefono: '',
      _id: '',
    }
    */

  constructor(
    private _clienteService: ClienteService,
    private _router: Router
  ) {
    this.token = localStorage.getItem('token');

    if (this.token) {
      let obj_lc: any = localStorage.getItem('user_data');
      this.user_login = JSON.parse(obj_lc);
      console.log('Usuario con sesion iniciada', this.user_login)
      //this.obtener_carrito();
this.obtener_carrito_cliente()
     
    }


    this._clienteService.get_categorias_publico().subscribe(
      response => {
        this.categorias = response.data;
        console.log('categorias', this.categorias)
      }
    );


  }

obtener_carrito_cliente(){
  this._clienteService.obtener_carrito_cliente(this.user_login?._id, this.token).subscribe(
    response => {
      this.carrito_arr = response.data
      console.log(this.carrito_arr)
      this.calcular_carrito()
    }
//Acomodar datos de acuerdo a la variedad
  )
}

  ngOnInit(): void {

    this.socket.on('new-carrito',function(this:any,data:any){
      console.log(data)
      this.obtener_carrito_cliente()
    }.bind(this))


    this.socket.on('new-carrito-add',function(this:any,data:any){
      console.log(data)
      this.obtener_carrito_cliente()
    }.bind(this))
/*
    this.socket.on('new-carrito',function(data){
      console.log(data)
      this.obtener_carrito_cliente()
    }.bind(this))
*/


  }

  login(loginForm: any) {

    if (loginForm.valid) {
      let email = loginForm.value.email;
      let password = loginForm.value.password;
      if (email == '' && password == '') {
        iziToast.show({
          title: 'ERROR DATA',
          class: 'iziToast-danger',
          position: 'topRight',
          message: 'Todos los campos son requeridos, vuelva a intentar.'
        });
      } else {
        this._clienteService.login_cliente({ email, password }).subscribe(
          response => {
            console.log(response);

            if (response.data != null) {
              this.token = response.jwt;
              localStorage.setItem('token', response.token);
              localStorage.setItem('identity', response.data._id);
              localStorage.setItem('user_data', JSON.stringify(response.data));
              //this._router.navigate(['']);
              $('#modal-signin').modal('hide');
              this.user_login = response.data
            } else {
              iziToast.show({
                title: 'ERROR USER',
                class: 'iziToast-danger',
                position: 'topRight',
                message: response.message
              });
            }

          },
          error => {
            iziToast.show({
              title: 'ERROR SERVER',
              class: 'iziToast-danger',
              position: 'topRight',
              message: 'Ocurrió un error en el servidor, intente mas nuevamente.'
            });
          }
        );
      }
    } else {
      iziToast.show({
        title: 'ERROR DATA',
        class: 'iziToast-danger',
        position: 'topRight',
        message: 'Complete correctamente el formulario.'
      });
    }
  }


  logout() {
    window.location.reload();
    localStorage.removeItem('token');
    localStorage.removeItem('_id');
    localStorage.removeItem('user_data');

    this._router.navigate(['/']).then(() => {
      window.location.reload();
    });;

    console.log('Logout', this.user_login)
  }

  op_modal_cart() {
    if (!this.op_cart) {
      this.op_cart = true
      $('#cart').addClass('show')
    } else {
      this.op_cart = false
      $('#cart').removeClass('show')
    }
  }



calcular_carrito(){
  this.carrito_arr.forEach(element=>
  {
this.subtotal=this.subtotal+parseInt(element.producto.precio)
  }
  )
}

eliminar_item(item_id:any){
  this._clienteService.eliminar_carrito_cliente(item_id,this.token).subscribe(
    response=>{

      iziToast.show({
        title: '¡Puff! Producto eliminado',
        titleColor: '#FF0000',
        class: 'text-danger',
        position: 'topRight',
        message: '🎉 ¡Ahora hay más espacio para nuevas aventuras de compra! 🛒🌟'

      });

      this.socket.emit('delete-carrito',{data:response.data})
      console.log(response)
    }
  )
  }


}
