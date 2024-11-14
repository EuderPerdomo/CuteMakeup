import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../../service/cliente.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Cliente } from '../../../app/cliente';

import { io } from 'socket.io-client'

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
  public subtotal = 0
  public socket = io('http://localhost:4201')
  public id_usuario: any

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
      this.id_usuario = localStorage.getItem('identity');
      //this.obtener_carrito();
      console.log('Recarga TOKEN nAV')
      this.obtener_carrito_cliente()
    }
    else {
      this.id_usuario = localStorage.getItem('cartID');
      if (this.id_usuario) {
        console.log('Recarga CARTID NAV')
        this.obtener_carrito_cliente()
      }
      else{
        console.log('no existe token ni cartid')
        this.id_usuario = this._clienteService.generateCartID();
        localStorage.setItem('cartID', this.id_usuario);
      }
    }

    this._clienteService.get_categorias_publico().subscribe(
      response => {
        this.categorias = response.data;
      }
    );
  }

  obtener_carrito_cliente() {
    //To do el siempre debe validar que haya un token o un cartid
if(this.id_usuario || this.token){
//Obtengo carrito
}else{
  //Miro si
}

    console.log('No recarga NAV')
    console.log('obteniendo el carrito del cliente NAV',this.id_usuario,this.token)
    this._clienteService.obtener_carrito_cliente(this.id_usuario, this.token).subscribe(
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

        this.calcular_carrito()
      }
      //Acomodar datos de acuerdo a la variedad
    )
  }

  ngOnInit(): void {

    this.socket.on('new-carrito', function (this: any, data: any) {

      this.obtener_carrito_cliente()
    }.bind(this))


    this.socket.on('new-carrito-add', function (this: any, data: any) {
      console.log('se agrego algo al carrito debo buscarlo')
      this.obtener_carrito_cliente()
    }.bind(this))
  }


  login(loginForm: any) {
    if (loginForm.valid) {
      const { email, password } = loginForm.value;

      this._clienteService.login_cliente({ email, password }).subscribe(
        response => {
          if (response.data) {
            // Guardar token e identidad
            this.token = response.jwt;
            localStorage.setItem('token', response.token);
            localStorage.setItem('identity', response.data._id);
            localStorage.setItem('user_data', JSON.stringify(response.data));
            $('#modal-signin').modal('hide');

            this.id_usuario=response.data._id
            this.token=response.token

            this.user_login = response.data;

            // Verificar si hay carrito temporal
            const cartID = localStorage.getItem('cartID');
            if (!cartID) {
              // Si no hay carrito temporal, obtener el carrito del cliente autenticado
              this.obtener_carrito_cliente();
            } else {
              // Si hay carrito temporal, intentar fusionar
              this._clienteService.fusionar_carrito_cliente(cartID, response.data._id, response.token).subscribe(
                res => {
                  // Eliminar cartID después de la fusión y actualizar carrito
                  localStorage.removeItem('cartID');
                  this.obtener_carrito_cliente(); // Actualiza el carrito tras la fusión
                },
                error => {
                  console.error("Error al fusionar carritos:", error);
                  iziToast.show({
                    title: 'ERROR CARRITO',
                    class: 'iziToast-danger',
                    position: 'topRight',
                    message: 'No se pudo fusionar el carrito.'
                  });
                }
              );
            }
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
            message: 'Ocurrió un error en el servidor, intente nuevamente.'
          });
        }
      );
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
    localStorage.removeItem('identity');
    localStorage.removeItem('_id');
    localStorage.removeItem('user_data');

    this._router.navigate(['/']).then(() => {
      window.location.reload();
    });;
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



  calcular_carrito() {
    this.subtotal = 0
    this.carrito_arr.forEach(element => {
      console.log(element)
      this.subtotal = this.subtotal + parseInt(element.precio)* parseInt(element.cantidad) //element.producto.precio
    }
    )
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
        this.calcular_carrito()
      }
    )
  }


}
