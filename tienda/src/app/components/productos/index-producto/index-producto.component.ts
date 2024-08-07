import { Component, OnInit } from '@angular/core';
import { NavComponent } from '../../nav/nav.component';
import { FooterComponent } from '../../footer/footer.component';
import { ClienteService } from '../../../service/cliente.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { io } from 'socket.io-client';

declare var jQuery: any;
declare var iziToast: { show: (arg0: { title: string; class: string; titleColor: string; position: string; message: string; }) => void; };
declare var $: any;

declare var noUiSlider: any

@Component({
  selector: 'app-index-producto',
  standalone: true,
  imports: [NavComponent, FooterComponent, CommonModule, FormsModule, NgbPaginationModule, RouterModule],
  templateUrl: './index-producto.component.html',
  styleUrl: './index-producto.component.css'
})
export class IndexProductoComponent implements OnInit {

  public categorias: Array<any> = [];
  public filtrar_categoria = ''
  public productos: Array<any> = []
  public filtro_producto = ''

  public filtro_categoria_producto = 'todos'
  public token: any
  public socket=io('http://localhost:4201')


  //Precargador
  public load_data = true

  //Categoria de la ruta
  public route_categoria: any

  // Paginación
  public page = 1
  public pageSize = 15

  public sort_by = 'Defecto'


  //Agregar al carrito
  public carrito_data: any = {
    variedad: '',
    cantidad: 1
  }
  public btn_cart = false


  constructor(
    private _clienteService: ClienteService,
    private _route: ActivatedRoute,
  ) {

    this.token = localStorage.getItem('token')

    this._route.params.subscribe(
      params => {
        this.route_categoria = params['categoria']
        if (this.route_categoria) {
          this._clienteService.listar_productos_public('').subscribe(
            response => {
              this.productos = response.data
              console.log(this.productos)
              this.productos = this.productos.filter(item => item.categoria.titulo == this.route_categoria)
              this.load_data = false
            },
          )

        } else {
          console.log('pRODUCTOS buscar no categoria')
          this._clienteService.listar_productos_public('').subscribe(
            response => {
              this.productos = response.data
              console.log(this.productos)
              this.load_data = false
            },
          )

        }
      }
    )

  }

  ngOnInit(): void {

    var slider: any = document.getElementById('slider');

    noUiSlider.create(slider, {
      start: [0, 25000],
      connect: true,
      range: {
        'min': 0,
        'max': 150000
      },
      tooltips: [true, true],
      pips: {
        mode: 'count',
        values: 5,
      },
    })

    slider.noUiSlider.on('update', function (values: any) {

      $('.range-slider-value-min').val(values[0]);
      $('.range-slider-value-max').val(values[1]);
    });
    $('.noUi-tooltip').css('font-size', '11px');


    /*Iniciamos obtencion de las categorias */
    this._clienteService.get_categorias_publico().subscribe(
      response => {
        this.categorias = response.data;
      }
    );
  }

  buscar_categoria() {
    if (this.filtrar_categoria) {
      var search = new RegExp(this.filtrar_categoria, 'i')
      this.categorias = this.categorias.filter(
        item => search.test(item.titulo)
      )
    } else {
      this._clienteService.get_categorias_publico().subscribe(
        response => {
          this.categorias = response.data;
        }
      );
    }
  }

  buscar_producto() {
    this._clienteService.listar_productos_public(this.filtro_producto).subscribe(
      response => {
        this.productos = response.data
        this.load_data = false
      },
    )
  }


  buscar_precios() {

    this._clienteService.listar_productos_public(this.filtro_producto).subscribe(
      response => {
        this.productos = response.data


        let min = parseInt($('.range-slider-value-min').val())
        let max = parseInt($('.range-slider-value-max').val())

        this.productos = this.productos.filter((item) => {
          return item.precio >= min && item.precio <= max
        })


      }

    )

  }


  buscar_por_categoria() {

    if (this.filtro_categoria_producto == 'todos') {

      this._clienteService.listar_productos_public(this.filtro_producto).subscribe(
        response => {
          this.productos = response.data
          this.load_data = false
        }
      )

    } else {
      this._clienteService.listar_productos_public(this.filtro_producto).subscribe(
        response => {
          this.productos = response.data
          this.productos = this.productos.filter(item => item.categoria.titulo == this.filtro_categoria_producto)
          this.load_data = false
        }
      )


    }

  }

  reset_productos() {
    this.filtro_producto = ''
    this._clienteService.listar_productos_public('').subscribe(
      response => {
        this.productos = response.data
        this.load_data = false
      }
    )

  }

  ordenar_por() {
    if (this.sort_by == 'Defecto') {
      this._clienteService.listar_productos_public('').subscribe(
        response => {
          this.productos = response.data
          this.load_data = false
        }
      )
    }
    //Popularidad
    else if (this.sort_by == 'Popularidad') {
      this.productos.sort(function (a, b) {
        if (a.nventas < b.nventas) {
          return 1
        }
        if (a.nventas > b.nventas) {
          return -1
        }
        return 0
      })
    }
    //Precio +-
    else if (this.sort_by == '+-precio') {
      this.productos.sort(function (a, b) {
        if (a.precio > b.precio) {
          return 1
        }
        if (a.precio < b.precio) {
          return -1
        }
        return 0
      })
    }

    //Precio -+
    else if (this.sort_by == '-+precio') {
      this.productos.sort(function (a, b) {
        if (a.precio < b.precio) {
          return 1
        }
        if (a.precio > b.precio) {
          return -1
        }
        return 0
      })
    }

    //Titulo AZ
    else if (this.sort_by == 'az') {
      this.productos.sort(function (a, b) {
        if (a.titulo > b.titulo) {
          return 1
        }
        if (a.titulo < b.titulo) {
          return -1
        }
        return 0
      })
    }

    //Titulo ZA
    else if (this.sort_by == 'za') {
      this.productos.sort(function (a, b) {
        if (a.titulo < b.titulo) {
          return 1
        }
        if (a.titulo > b.titulo) {
          return -1
        }
        return 0
      })
    }


  }


  //Productos al carrito
  agregar_producto(producto: any) {
    console.log(producto,producto.variedades[0]._id)

    let data = {
      producto: producto._id,
      cliente: localStorage.getItem('identity'),
      cantidad: 1,
      variedad: producto.variedades[0]._id

    }
    this.btn_cart = true

    this._clienteService.agregar_carrito_cliente(data, this.token).subscribe(
      response => {

        if (response.data == undefined) {

          iziToast.show({
            title: 'ERROR',
            titleColor: '#FF0000',
            class: 'text-danger',
            position: 'topRight',
            message: 'El producto ya se encuentra en el carrito'

          });
          this.btn_cart = false
        } else {
          iziToast.show({
            title: ' ¡Genial! ',
            titleColor: 'green',
            class: 'text-success',
            position: 'topRight',
            message: 'producto Agregado al carrito'
          });
          this.socket.emit('add-carrito-add',{data:true})
          this.btn_cart = false
          

        }
      }
    )

  }


}
