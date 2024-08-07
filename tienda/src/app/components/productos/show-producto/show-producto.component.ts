import { AfterViewInit, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NavComponent } from '../../nav/nav.component';
import { FooterComponent } from '../../footer/footer.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { GuestService } from '../../../service/guest.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Producto, Galeria } from '../../../producto';
import { ClienteService } from '../../../service/cliente.service';

import {io} from 'socket.io-client'

declare var tns: any
declare var lightGallery: any
declare var iziToast:any
declare var $: any

@Component({
  selector: 'app-show-producto',
  standalone: true,
  imports: [NavComponent, FooterComponent, CommonModule, RouterModule, FormsModule],
  templateUrl: './show-producto.component.html',
  styleUrl: './show-producto.component.css'
})
export class ShowProductoComponent implements AfterViewInit {

  public slug: any


  public producto: Producto = {
    titulo: '',
    slug: '',
    galeria: [],
    portada: '',
    precio: '',
    descripcion: '',
    contenido: '',
    stock: '',
    nventas: '',
    npuntos: '',
    variedades: [],
    categoria: { titulo: '', slug: '',_id:'' },
    titulo_variedad: '',
    estado: '',
    _id: ''
  }

  public token:any

  public galeria: Galeria[] = [];
  public galeria2: Galeria[] = [];

  public variedad_seleccionada: any
  public galeria_seleccionada: any

  public carrusel: any;
  public slider: any;
  public carrusel2: any[] = []

  public socket=io('http://localhost:4201')

  //recomendados
  public productosRecomendados: Array<any> = []


  public sliderSelector: string = '.my-slider';
  public cachedSlider: any;



//Agregar al carrito
public carrito_data:any={
  variedad:'',
  cantidad:1
}
public btn_cart=false

  constructor(
    private _route: ActivatedRoute,
    private _guestService: GuestService,
    private cdr: ChangeDetectorRef,
    private _clienteService: ClienteService,
  ) {

this.token=localStorage.getItem('token')

    this._route.params.subscribe(
      params => {
        this.slug = params['slug']
        this._guestService.obtener_producto_public(this.slug).subscribe(
          response => {
            console.log(response.data)

            this.producto = response.data

//Asignar todas las Imagenes a galeria2
//tomando en cuenta su variedad mediante el id y la url de la imagen
//Recorro  cada una de las variedades e ingreso a su atributo galeria y agrego la imagen con los detalles al arreglo

for (let index = 0; index < this.producto.variedades.length; index++) {
  const element = this.producto.variedades[index];
  console.log('elementos',element._id)

  for (let j = 0; j < element.galeria.length; j++) {
    const elemento = element.galeria[j];
    console.log('elementos internos',elemento.imagen,'id_variedad',element._id)
    var agregar={
      imagen:elemento.imagen,
      variedad:element._id
    }
    this.carrusel2.push(agregar)
  }
  
}

console.log('Segundo carrusel',this.carrusel2)


            this.variedad_seleccionada = this.producto.variedades[0]
            console.log('variedad', this.variedad_seleccionada)

            this.galeria_seleccionada = this.variedad_seleccionada.galeria
            console.log('Galeria', this.galeria_seleccionada)
            this.galeria = this.galeria_seleccionada



            this._guestService.listar_productos_recomendado_public(this.producto.categoria._id).subscribe(
              response => {
                this.productosRecomendados = response.data
        
              }
            )

          }

        )


      }
    )
  }

  //Galeria del producto
  ngAfterViewInit(): void {

  
    //this.iniciarCarrusel()

    setTimeout(() => {
      console.log('Galeri actual, primera vez',this.galeria)
      this.carrusel = tns({
        container: '.tns-carousel-inner',
        controlsText: ['<i class="ci-arrow-left"></i>', '<i class="ci-arrow-right"></i>'],
        navPosition: "top",
        controlsPosition: "top",
        mouseDrag: !0,
        speed: 600,
        autoplayHoverPause: !0,
        autoplayButtonOutput: !1,
        navContainer: "#tns-thumbnails",
        navAsThumbnails: true,
        gutter: 15,
      });


      console.log('Carrusel Inicial ',this.carrusel.getInfo())

      //Galeria del Producto en pestaña aparte
      var e = document.querySelectorAll(".gallery");
      if (e.length) {
        for (var t = 0; t < e.length; t++) {
          lightGallery(e[t], { selector: ".gallery-item", download: !1, videojs: !0, youtubePlayerParams: { modestbranding: 1, showinfo: 0, rel: 0 }, vimeoPlayerParams: { byline: 0, portrait: 0 } });
        }
      }

      //Productos recomendados

      tns({
        container: '.tns-carousel-inner-two',
        controlsText: ['<i class="ci-arrow-left"></i>', '<i class="ci-arrow-right"></i>'],
        navPosition: "top",
        controlsPosition: "top",
        mouseDrag: !0,
        speed: 600,
        autoplayHoverPause: !0,
        autoplayButtonOutput: !1,
        nav: false,
        controlsContainer: "#custom-controls-related",
        responsive: {
          0: {
            items: 1,
            gutter: 20
          },
          480: {
            items: 2,
            gutter: 24
          },
          700: {
            items: 3,
            gutter: 24
          },
          1100: {
            items: 4,
            gutter: 30
          }
        }
      });

      console.log('inicia el slider despues de iniciado el primero')
      this.initSlider(); //Inicia mi tercer carrusel
      this.initCache();

    }, 500)


  }

  iniciarCarrusel(): void {
    console.log('Carrusel actual ',this.carrusel)
    if (this.carrusel) {
      console.log('destruyo el carrusel')
      this.carrusel.destroy();
     //this.carrusel = this.carrusel.rebuild()
    }
    console.log('Carrusel despues de destruido ',this.carrusel)

    console.log('Galeri despues de destruir ',this.galeria)

    this.carrusel = tns({
      container: '.tns-carousel-inner',
      controlsText: ['<i class="ci-arrow-left"></i>', '<i class="ci-arrow-right"></i>'],
      navPosition: "top",
      controlsPosition: "top",
      mouseDrag: !0,
      speed: 600,
      autoplayHoverPause: !0,
      autoplayButtonOutput: !1,
      navContainer: "#tns-thumbnails",
      navAsThumbnails: true,
      gutter: 15,
    });

    console.log('Carrusel Reconstruido ',this.carrusel.getInfo())
  }

  cambioVariedad() {

    const variedadSeleccionada = this.producto.variedades.find(variedad => variedad._id === this.variedad_seleccionada);

    if (variedadSeleccionada) {
      this.galeria_seleccionada = variedadSeleccionada.galeria
      this.galeria = variedadSeleccionada.galeria


      this.cdr.detectChanges();
      setTimeout(() => {
        this.iniciarCarrusel();
        console.log(this.galeria_seleccionada);
      }, 0);

      //this.iniciarCarrusel()
      //console.log(this.galeria_seleccionada)
    }

    //this.galeria_seleccionada=this.variedad_seleccionada.galeria
    //this.variedad_seleccionada = this.variedad_seleccionada.filter(item => item.galeria._id == this.filtro_categoria_producto)
  }


  cambioVariedad2() {
console.log('Variedad que selecciono el usuario', this.variedad_seleccionada)

    if (this.carrusel) {
      console.log('en cambio variedad',this.carrusel)
     // console.log('slider',this.carrusel.getInfo().slideItems)
      this.carrusel.destroy();
    }
    

    const variedadSeleccionada = this.producto.variedades.find(variedad => variedad._id === this.variedad_seleccionada);
    console.log('variedadSeleccionada', variedadSeleccionada)

    console.log('Variedad que selecciono',this.variedad_seleccionada)
    if (variedadSeleccionada) {
      this.galeria_seleccionada = variedadSeleccionada.galeria
      this.galeria = variedadSeleccionada.galeria
      this.cdr.detectChanges();
      setTimeout(() => {
        this.iniciarCarrusel();
        console.log(this.galeria_seleccionada);
      }, 0);

    }

  }

agregar_producto(){

  this.carrito_data.variedad=this.variedad_seleccionada

  if(this.carrito_data.variedad != ''){

    if(this.carrito_data.cantidad <= this.producto.stock){
let data={
  producto:this.producto._id,
  cliente:localStorage.getItem('identity'),
  cantidad:this.carrito_data.cantidad,
  variedad:this.variedad_seleccionada
  
}
this.btn_cart=true

this._clienteService.agregar_carrito_cliente(data,this.token).subscribe(
response=>{

if(response.data==undefined){

  iziToast.show({
    title: 'ERROR',
    titleColor: '#FF0000',
    color: '#FFF',
    class: 'text-danger',
    position: 'topRight',
    message: 'El producto ya se encuentra en el carrito'
    
  });
  this.btn_cart=false
}else{
  iziToast.show({
    title: ' ¡Genial! ',
    titleColor: 'green',
    color: '#FFF',
    class: 'text-success',
    position: 'topRight',
    message: 'producto Agregado al carrito'
  });
  this.socket.emit('add-carrito-add',{data:true})
  this.btn_cart=false

}
}
)

    }else{
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FF0000',
        color: '#FFF',
        class: 'text-danger',
        position: 'topRight',
        message: 'La cantidad seleccionada excede el Stock Disponible'+this.producto.stock
      });
    }



  }else{
    iziToast.show({
      title: 'ERROR',
      titleColor: '#FF0000',
      color: '#FFF',
      class: 'text-danger',
      position: 'topRight',
      message: 'Seleccione una variedad'
    });
  }

}



///Iniciamos tercer carrusel

ngOnInit(): void {
  // Inicializa el cache
  //this.initCache();
}



ngOnDestroy(): void {
  // Destruye el slider al destruir el componente
  if (this.slider) {
    this.slider.destroy();
  }
}

initCache() {
  console.log('selector de slider',this.sliderSelector)
  const $body = $('body');
  this.cachedSlider = $body.find(this.sliderSelector)[0].cloneNode(true);
  console.log('cache slider',this.cachedSlider)
}

initSlider() {
  const sliderElement = document.querySelector('.my-slider');
console.log('existe o no, antes de inicializarlo',sliderElement)

this.slider= tns({
  container: this.sliderSelector,
  controlsText: ['<i class="ci-arrow-left"></i>', '<i class="ci-arrow-right"></i>'],
  navPosition: "top",
  controlsPosition: "top",
  mouseDrag: !0,
  speed: 600,
  autoplayHoverPause: !0,
  autoplayButtonOutput: !1,
  navContainer: "#tns-thumbnails2",
  navAsThumbnails: true,
  gutter: 15,
});

    console.log('slider inicializado', this.slider,'selector', this.sliderSelector)
    const sliderElemente = document.querySelector('.my-slider');
    console.log('despues de inicializado',sliderElemente)

 

  //console.log('slider inicializado', this.slider.getInfo().slideItems)
  
}

filterOriginal(filterValue: string) {
  if (this.slider) {
    console.log('slider', this.slider.getInfo().slideItems)
    this.slider.destroy();
  }

  const $sliderContainer = $(this.sliderSelector);
  $sliderContainer.html(this.cachedSlider.innerHTML);

  if (filterValue !== 'all') {
    console.log('difierente de all', filterValue)
    $sliderContainer.find('[data-type]').not(`[data-type*=${filterValue}]`).remove();

  }

  this.initSlider();
  this.cdr.detectChanges();
}

filtersdsd() {
  var filterValue=this.variedad_seleccionada
  console.log('variedad que selecciono',filterValue)

  if (this.slider) {
    console.log('slider a destruir', this.slider.getInfo().slideItems)
    this.slider.destroy();
  }

  const sliderElement = document.querySelector('.my-slider');
console.log('Antes de estado original',sliderElement)


  const $sliderContainer = $(this.sliderSelector);
  $sliderContainer.html(this.cachedSlider.innerHTML);

  const sliderElement2 = document.querySelector('.my-slider');
  console.log('ahora en estado original original',this.cachedSlider,'despues',sliderElement2)

  if (filterValue !== 'all') {
    console.log('difierente de all', filterValue)
    const elementsToKeep = $sliderContainer.find(`[data-type*=${filterValue}]`);
    console.log('conserva',elementsToKeep)


    const elementsToRemove = $sliderContainer.find('[data-type]').not(`[data-type*=${filterValue}]`);
console.log('Elements to remove:', elementsToRemove);


    $sliderContainer.find('[data-type]').not(`[data-type*=${filterValue}]`).remove();

  }

  this.initSlider();
  this.cdr.detectChanges();
}


filter() {
  var filterValue = this.variedad_seleccionada;
  console.log('variedad que selecciono', filterValue);

  if (this.slider) {
    console.log('slider a destruir', this.slider.getInfo().slideItems);
    this.slider.destroy();
  }

  const $sliderContainer = $(this.sliderSelector);
  $sliderContainer.html(this.cachedSlider.innerHTML);

  console.log('Estado original', this.cachedSlider);

  if (filterValue !== 'all') {
    console.log('diferente de all', filterValue);

    // Selecciona los elementos que se deben mantener
    const elementsToKeep = $sliderContainer.find(`[data-type*=${filterValue}]`);
    console.log('conserva', elementsToKeep);

    // Selecciona los elementos que se deben eliminar
    const elementsToRemove = $sliderContainer.find('[data-type]').not(`[data-type*=${filterValue}]`);
    console.log('Elements to remove:', elementsToRemove);

    // Asegúrate de que solo se eliminan los elementos correctos
    elementsToRemove.each(() => {
      console.log('Eliminando elemento', $(this));
      $(this).remove();
    });
  }

  this.initSlider();
  this.cdr.detectChanges();
}





///Finalizamos 3 Carrusel



}
