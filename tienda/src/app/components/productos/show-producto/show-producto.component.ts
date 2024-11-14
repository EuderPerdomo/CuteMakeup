import { AfterViewInit, Component, OnInit, ChangeDetectorRef, ElementRef, CUSTOM_ELEMENTS_SCHEMA,ViewChild } from '@angular/core';
import { NavComponent } from '../../nav/nav.component';
import { FooterComponent } from '../../footer/footer.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { GuestService } from '../../../service/guest.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Producto, Galeria, Tamano_Disponibilidad } from '../../../producto';
import { ClienteService } from '../../../service/cliente.service';
import { Card } from '../../../interfaces/card';

import { io } from 'socket.io-client'
import { register } from 'swiper/element/bundle';
// register Swiper custom elements
register();

declare var tns: any
declare var lightGallery: any
declare var iziToast: any
declare var $: any

@Component({
  selector: 'app-show-producto',
  standalone: true,
  imports: [NavComponent, FooterComponent, CommonModule, RouterModule, FormsModule],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './show-producto.component.html',
  styleUrl: './show-producto.component.css',
})
export class ShowProductoComponent implements  OnInit, AfterViewInit {

  pageUrl: string = window.location.href; // URL de la página actual
  shareText: string = "¡Mira este increíble contenido!";
  imageUrl: string = "https://example.com/image.jpg";

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
    categoria: { titulo: '', slug: '', _id: '' },
    titulo_variedad: '',
    estado: '',
    _id: ''
  }

  public token: any

  public galeria: Galeria[] = [];
  public galeria2: Galeria[] = [];

  //public variedad_seleccionada: any
  public variedad_seleccionada: any = '';//Inicialmente all public variedad_seleccionada: string = 'all';
  public subvariedad_seleccionada: any[] = [] //Representa el arreglo con las caracteristicas de la subvariedad actual
  public subvariedad: string = ''; //Representa el Id de la Subvariedad

  public galeria_seleccionada: any
  public tamano_disponibilidad: Tamano_Disponibilidad[] = [];

  public carrusel: any;
  public slider: any;
  public carrusel2: any[] = []
  public carrusel_original: any[]=[];

  public socket = io('http://localhost:4201')

  //recomendados
  public productosRecomendados: Array<any> = []


  public sliderSelector: string = '.my-slider';
  public cachedSlider: any;

  public lightGallerySelector: string = '.gallery-item';

  public ThumbnailsSelector: string = '.thumbnails_remove';
  public cachedSliderThumbnails: any


  //LightGalery
  public migaleria: any
  //Finaliza LightGalery

  //Agregar al carrito
  public carrito_data: any = {
    variedad: '',
    cantidad: 1,
    subvariedad: ''
  }
  public btn_cart = false

  constructor(
    private _route: ActivatedRoute,
    private _guestService: GuestService,
    private cdr: ChangeDetectorRef,
    private _clienteService: ClienteService,
  ) {
    
    window.scrollTo(0, 0);

    this.token = localStorage.getItem('token')

    this._route.params.subscribe(
      params => {
        this.slug = params['slug']
        this._guestService.obtener_producto_public(this.slug).subscribe(
          response => {
            this.producto = response.data
            //Subvariedad_seleccionada representa el arreglo de subvariedades

            for (let i = 0; i < this.producto.variedades[0].tamano_disponibilidad.length; i++) {
              const elemento = this.producto.variedades[0].tamano_disponibilidad[i];
              var tamano = {
                tamano: elemento.tamano,
                unidad_medida: elemento.unidad_medida,
                disponibilidad: elemento.disponibilidad,
                precio: elemento.precio,
                _id: elemento._id
              }
              this.subvariedad_seleccionada.push(tamano)
            }


            if (this.producto.variedades && this.producto.variedades.length > 0) {
              // Seleccionar la primera variedad y su primera subvariedad
              const primeraVariedad = this.producto.variedades[0];
              const primeraSubvariedad = primeraVariedad.tamano_disponibilidad[0];

              // Asignar los valores iniciales
              this.producto.precio = primeraSubvariedad.precio;
              this.producto.stock = primeraSubvariedad.disponibilidad
              this.variedad_seleccionada = primeraVariedad._id;
              this.subvariedad = primeraSubvariedad._id;

              // Inicializar subvariedad_seleccionada con el primer tamaño y disponibilidad
              //this.subvariedad_seleccionada.push(primeraSubvariedad);

              // Llenar el carrusel con las imágenes de las variedades
              for (let variedad of this.producto.variedades) {
                for (let galeriaItem of variedad.galeria) {
                  this.carrusel2.push({
                    imagen: galeriaItem.imagen,
                    variedad: variedad._id
                  });

                  this.carrusel_original.push({
                    imagen: galeriaItem.imagen,
                    variedad: variedad._id
                  });
                }

                }
                
                
              
              
            }
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


ngOnInit(): void {
  
}



  //Galeria del producto
  ngAfterViewInit(): void {

    //this.swiper.nativeElement.swiper.activeIndex = this.index;
    //this.swiperThumbs.nativeElement.swiper.activeIndex = this.index;


    setTimeout(() => {
      //Productos recomendados
/* activar para dejar igual
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
*/
     /// this.iniciarLightGalery()
     // this.initSlider(); //Inicia mi tercer carrusel
     // this.initCache();

    }, 500)


  }


  agregar_producto_carrito() {

    this.carrito_data.variedad = this.variedad_seleccionada;
    this.carrito_data.subvariedad = this.subvariedad;

    if (this.carrito_data.variedad != '' && this.carrito_data.variedad != 'all' && this.carrito_data.subvariedad != '') {

      if (this.carrito_data.cantidad <= this.producto.stock) {

        let clienteID: any;
        let token = localStorage.getItem('token');  // Verificamos si hay un token

        var data: any = {}

        if (token) {
          // Cliente autenticado
          clienteID = localStorage.getItem('identity');

          data.producto = this.producto._id
          data.cliente = clienteID,  // Usar clienteID (identity o cartID)
            data.cantidad = this.carrito_data.cantidad,
            data.variedad = this.variedad_seleccionada,
            data.subvariedad = this.subvariedad,
            data.precio = this.producto.precio


        } else {
          // Cliente no autenticado: Generar un cartID
          clienteID = localStorage.getItem('cartID'); //Mire si existe un cartID y traelo
          if (!clienteID) {
            clienteID = this._clienteService.generateCartID();  // Generar un nuevo cartID si clienteID es null
          
            localStorage.setItem('cartID', clienteID);
         
            data.producto = this.producto._id
            data.cliente_no_autenticado = clienteID,  // Usar clienteID (identity o cartID)
              data.cantidad = this.carrito_data.cantidad,
              data.variedad = this.variedad_seleccionada,
              data.subvariedad = this.subvariedad,
              data.precio = this.producto.precio

          } else {
   
            data.producto = this.producto._id
            data.cliente_no_autenticado = clienteID,  // Usar clienteID (identity o cartID)
              data.cantidad = this.carrito_data.cantidad,
              data.variedad = this.variedad_seleccionada,
              data.subvariedad = this.subvariedad,
              data.precio = this.producto.precio
          }
        }

        this.btn_cart = true;

        this._clienteService.agregar_carrito_cliente(data, token).subscribe(
          response => {
            if (response.data == undefined) {
              iziToast.show({
                title: 'ERROR',
                titleColor: '#FF0000',
                color: '#FFF',
                class: 'text-danger',
                position: 'topRight',
                message: 'El producto ya se encuentra en el carrito'
              });
              this.btn_cart = false;
            } else {
              iziToast.show({
                title: ' ¡Genial! ',
                titleColor: 'green',
                color: '#FFF',
                class: 'text-success',
                position: 'topRight',
                message: 'Producto agregado al carrito'
              });
              this.socket.emit('add-carrito-add', { data: true });
              this.btn_cart = false;
            }
          }
        );
      } else {
        iziToast.show({
          title: 'ERROR',
          titleColor: '#FF0000',
          color: '#FFF',
          class: 'text-danger',
          position: 'topRight',
          message: 'La cantidad seleccionada excede el Stock Disponible' + this.producto.stock
        });
      }
    } else {
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


  ngOnDestroy(): void {
    // Destruye el slider al destruir el componente
    if (this.slider) {
      this.slider.destroy();
    }
  }

  initCache() {

    const $body = $('body');
    this.cachedSlider = $body.find(this.sliderSelector)[0].cloneNode(true);
    this.cachedSliderThumbnails = $body.find(this.ThumbnailsSelector)[0].cloneNode(true);

  }

  initSlider() {

    this.slider = tns({
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

  }

  iniciarLightGalery() {
    var e = document.querySelectorAll(".gallery");
    if (e.length) {
      for (var t = 0; t < e.length; t++) {
        lightGallery(e[t], {
          selector: this.lightGallerySelector,
          download: false,
        });
      }
    } else {
      //console.log('No se encontraron elementos con la clase .gallery');
    }

  }

  filter() {
    // Reinicia carrusel2 al estado original
    this.carrusel2 = [...this.carrusel_original]; // Usa un nuevo array para evitar referencias directas
  
    // Filtra solo si la variedad seleccionada no es "all"
    if (this.variedad_seleccionada !== "all") {
      this.carrusel2 = this.carrusel2.filter(item => item.variedad === this.variedad_seleccionada);
    }
  
    //console.log(this.variedad_seleccionada, this.carrusel2, this.carrusel_original);
  }

  filter1() {
    var filterValue = this.variedad_seleccionada
    //Llenar arreglo de subvariedades de acuerdo a la variedad seleccionada

    const selectedVariety = this.producto.variedades.find(v => v._id === this.variedad_seleccionada);


    if (selectedVariety) {
      this.subvariedad_seleccionada = selectedVariety.tamano_disponibilidad;
      this.subvariedad = selectedVariety.tamano_disponibilidad[0]._id
      this.producto.precio = selectedVariety.tamano_disponibilidad[0].precio
      this.producto.stock = selectedVariety.tamano_disponibilidad[0].disponibilidad

    } else {
      this.subvariedad_seleccionada = [];
    }

    if (this.slider) {
      this.slider.destroy();
    }

    const $sliderContainer = $(this.sliderSelector);
    const $thumbnailsContainer = $(this.ThumbnailsSelector)

    $sliderContainer.html(this.cachedSlider.innerHTML);
    $thumbnailsContainer.html(this.cachedSliderThumbnails.innerHTML);

    if (filterValue !== 'all') {

      $sliderContainer.find('[data-type]').not(`[data-type*=${filterValue}]`).remove();
      $thumbnailsContainer.find('[data-type]').not(`[data-type*=${filterValue}]`).remove();

    }

    this.initSlider();
    this.iniciarLightGalery()
    this.cdr.detectChanges();

  }



  filter_subvariedad(subvariedad: any) {

    const subvariedadSeleccionada = this.subvariedad_seleccionada.find(s => s._id === subvariedad);

    if (subvariedadSeleccionada) {
      this.producto.precio = subvariedadSeleccionada.precio;
      this.producto.stock = subvariedadSeleccionada.disponibilidad
    } else {
      // En caso de que no se encuentre la subvariedad, puedes asignar un valor por defecto o manejarlo como prefieras
      this.producto.precio = ''; // O algún valor por defecto
    }

  }

  ///Finalizamos 3 Carrusel

}
