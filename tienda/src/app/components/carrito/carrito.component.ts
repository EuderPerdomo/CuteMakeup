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

  public slider: any;
  public sliderSelector: string = '.my-slider';
  public cachedSlider: any;
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
    this.id_cliente = localStorage.getItem('identity')

    this._clienteService.obtener_carrito_cliente(this.id_cliente, this.token).subscribe(
      response => {
        this.carrito_arr = response.data
        console.log(this.carrito_arr)
        this.calcular_carrito()
      }
      //Acomodar datos de acuerdo a la variedad

    )

  }

  calcular_carrito() {
    this.carrito_arr.forEach(element => {
      this.subtotal = this.subtotal + parseInt(element.producto.precio)
    }
    )
    this.total_pagar = this.subtotal
  }



  ngOnInit(): void {
    // Inicializa el cache
    this.initCache();
  }

  ngAfterViewInit(): void {
    // Inicializa el slider
    this.initSlider();
  }

  ngOnDestroy(): void {
    // Destruye el slider al destruir el componente
    if (this.slider) {
      this.slider.destroy();
    }
  }

  initCache() {
    const $body = $('body');
    this.cachedSlider = $body.find(this.sliderSelector)[0].cloneNode(true);
    console.log('el cache slider',this.cachedSlider)
  }

  initSlider() {
    this.slider = tns({
      container: this.sliderSelector,
      loop: true,
      items: 1,
      slideBy: 'page',
      nav: false,
      autoplay: false,
      speed: 800,
      autoplayButtonOutput: false,
      mouseDrag: true,
      lazyload: true,
      controlsContainer: "#customize-controls",
      responsive: {
        640: {
          items: 2
        },
        768: {
          items: 3
        }
      }
    });

    console.log('slider inicializado', this.slider.getInfo().slideItems)
    this.initCache();

  }

  filter(filterValue: string) {
    if (this.slider) {
      console.log('slider', this.slider.getInfo().slideItems)
      this.slider.destroy();
    }

    const $sliderContainer = $(this.sliderSelector);
    $sliderContainer.html(this.cachedSlider.innerHTML);

    const sliderElemente = document.querySelector('.my-slider');
console.log('como es su estado original',sliderElemente)

    if (filterValue !== 'all') {
      console.log('difierente de all', filterValue)
      $sliderContainer.find('[data-type]').not(`[data-type*=${filterValue}]`).remove();

    }

    this.initSlider();
    this.cdr.detectChanges();
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
