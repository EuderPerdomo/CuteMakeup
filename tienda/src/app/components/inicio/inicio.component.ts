import { AfterViewInit, Component, OnInit, signal } from '@angular/core';
import { NavComponent } from '../nav/nav.component';
import { FooterComponent } from '../footer/footer.component';
import { RouterModule } from '@angular/router';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'; //Agregado para splineviewer
import { ClienteService } from '../../service/cliente.service';
import { CommonModule } from '@angular/common';

import { register, SwiperContainer } from 'swiper/element/bundle';
import { SwiperOptions } from 'swiper/types';
// register Swiper custom elements
register();

declare var tns: any

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [NavComponent, FooterComponent, RouterModule, CommonModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]//Agregado para splineViewer
})
export class InicioComponent implements OnInit, AfterViewInit {
  /*
    swiperParams = {
      slidesPerView: 3,
      breakpoints: {
        640: { slidesPerView: 2 },
        1024: { slidesPerView: 5 },
      },
      on: {
        init() {
          console.log('Swiper initialized');
        },
      },
    };
  */

  // swiperElement = signal<SwiperContainer | null>(null)
  public categorias: Array<any> = []
  public categoriasCarga = false

  public banners: Array<any> = [
  ]

  public new_productos: Array<any> = []
  public new_blogs: Array<any>=[]

  public load_datos_configuracion = false

  public datos_configuracion: Array<any> = []
  public envio_gratis = ''

  constructor(
    private _clienteService: ClienteService
  ) {
    this.categoriasCarga = true
    this._clienteService.get_categorias_publico().subscribe(
      response => {
        this.categorias = response.data;
        this.categoriasCarga = false
        console.log(this.categorias)
      }
    );

    this._clienteService.obtener_banner_public().subscribe(
      response => {
        this.banners = response.data[0].galeria;
        //this.categoriasCarga=false
        console.log('banner disponible', this.banners)
      }
    );


    this._clienteService.get_datos_configuracion().subscribe(
      response => {
        console.log('datos', response)
        //this.datos_configuracion = response;
        //console.log('this.datos_configuracion', this.datos_configuracion)
        this.envio_gratis = response[0].envio_gratis
        //this.load_datos_configuracion=true
      }
    );

  }


  iniciarCategorias() {
    /*
    console.log('Categorias', this.categorias)
      tns({
        container: '.tns-carousel-inner-two',
        controls: false,
        responsive: {
          0: {
            gutter: 20
          },
          400: {
            items: 2,
            gutter: 20
          },
          520: {
            gutter: 30
          },
          768: {
            items: 3,
            gutter: 30
          }
        }
        
      });
    */
  }


  ngAfterViewInit(): void {
    /*
    tns({  
      container: '.tns-carousel-inner',
      controlsText: ['<i class="ci-arrow-left"></i>', '<i class="ci-arrow-right"></i>'],
      mode: 'gallery',
      navContainer: '#pager',
      responsive: {
        0: { controls: false },
        991: { controls: true }
      }
    });*/
    /*
      if(this.categoriasCarga==false){
        tns({
          container: '.tns-carousel-inner-two',
          controls: false,
          responsive: {
            0: {
              gutter: 20
            },
            400: {
              items: 2,
              gutter: 20
            },
            520: {
              gutter: 30
            },
            768: {
              items: 3,
              gutter: 30
            }
          }
          
        });
      
        console.log('categorias Inicializadas')
    
      }
    */
/*
    tns({
      container: '.tns-carousel-inner-three',
      controls: false,
      mouseDrag: !0,
      responsive: {
        0: {
          items: 1,
          gutter: 20
        },
        420: {
          items: 2,
          gutter: 20
        },
        600: {
          items: 3,
          gutter: 20
        },
        700: {
          items: 3,
          gutter: 30
        },
        900: {
          items: 4,
          gutter: 30
        },
        1200: {
          items: 5,
          gutter: 30
        },
        1400: {
          items: 6,
          gutter: 30
        }
      }

    });*/
    /*
      tns({
        container: '.tns-carousel-inner-four',
        controls: false,
        gutter: 30,
        responsive: {
          "0": { "items": 1 },
          "380": { "items": 2 },
          "550": { "items": 3 },
          "750": { "items": 4 },
          "1000": { "items": 5 },
          "1250": { "items": 6 }
        }
      })*/

    tns({
      container: '.tns-carousel-inner-five',
      nav: false,
      controlsContainer: "#custom-controls-trending",
      responsive: {
        "0": {
          "items": 1,
          "gutter": 20
        },
        "480": {
          "items": 2,
          "gutter": 24
        },
        "700": {
          "items": 3,
          "gutter": 24
        },
        "1100": {
          "items": 4,
          "gutter": 30
        }
      }
    })

    tns({
      container: ".tns-carousel-inner-six",
      nav: false,
      controlsContainer: "#custom-controls-sale",
      responsive: {
        "0": {
          "items": 1,
          "gutter": 20
        },
        "480": {
          "items": 2,
          "gutter": 24
        },
        "700": {
          "items": 3,
          "gutter": 24
        },
        "1100": {
          "items": 4,
          "gutter": 30
        }
      }
    })


    tns({
      container: ".tns-carousel-inner-seven",
      controls: false,
      gutter: 15,
      responsive: {
        "0": { "items": 2 },
        "500": { "items": 3 },
        "1200": { "items": 3 }
      }
    })

/*
    tns({
      container: ".tns-carousel-inner-eight",
      controls: false,
      gutter: 30,
      responsive: {
        "0": { "items": 1 },
        "576": { "items": 2 }
      }
    })*/

    tns({
      container: ".tns-carousel-inner-nine",
      nav: false,
      controls: false,
      autoplay: true,
      autoplayTimeout: 4000,
      responsive: {
        "0": {
          "items": 2
        },
        "576": {
          "items": 3
        },
        "768": {
          "items": 4
        },
        "992": {
          "items": 5
        },
        "1200": {
          "items": 6
        }
      }
    })



  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    const swiperEl = document.querySelector('.swiperPrueba') as SwiperContainer;
    const swiperNewProducts = document.querySelector('.swipernewProducts') as SwiperContainer;
    const swiperNewBlogs = document.querySelector('.swipernewBlogs') as SwiperContainer;

    const swiperParams: SwiperOptions = {
      slidesPerView: 3,
      pagination: {
        clickable: true,
      },
      navigation: true,
      spaceBetween: 30,
      breakpoints: {
        500: {
          slidesPerView: 2,
        },
        640: {
          slidesPerView: 3,
        },
        1024: {
          slidesPerView: 4,
        },
      },
      on: {
        init() {
          // ...
        },
      },
    };
    //Si el banner Fue encontrado
    if (swiperEl) {
      Object.assign(swiperEl, swiperParams);
      swiperEl.initialize()
      //this.swiperElement()?.initialize();
    }

    //Opciones para el swiper nuevosproductos
    const swiperParamsNewProducts: SwiperOptions = {
      slidesPerView: 3,
      pagination: {
        clickable: true,
      },
      navigation: true,
      spaceBetween: 30,
      breakpoints: {
        500: {
          slidesPerView: 2,
        },
        640: {
          slidesPerView: 3,
        },
        1024: {
          slidesPerView: 4,
        },
      },
      on: {
        init() {
          // ...
        },
      },
    };

    if (swiperNewProducts) {
      Object.assign(swiperNewProducts, swiperParamsNewProducts);
      swiperNewProducts.initialize()
    }

    //Inicializamos nuevos blogs

    const swiperParamsNewBlogs: SwiperOptions = {
      slidesPerView: 2,
      pagination: {clickable: true,},
      navigation: true,
      spaceBetween: 30,
      breakpoints: {
        500: {
          slidesPerView: 1,
        },
        640: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 2,
        },
      },
      on: {
        init() {
          // ...
        },
      },
    };
    //Si el banner Fue encontrado
    if (swiperNewBlogs) {
      Object.assign(swiperNewBlogs, swiperParamsNewBlogs);
      swiperNewBlogs.initialize()
      //this.swiperElement()?.initialize();
    }

    this._clienteService.listar_productos_nuevos_publico().subscribe(
      response => {
        this.new_productos = response.data
      }
    )

    
    this._clienteService.listar_blog_nuevos_publico().subscribe(
      response => {
        this.new_blogs = response.data
      }
    )

    setTimeout(() => {
      this.iniciarCategorias()
    }, 1000);
  }

  login() {
    console.log('login')
  }

  getCloudinaryImageUrl(imageUrl: string, width: number, height: number, crop: string = 'fill'): string {
    // Verifica que la URL esté configurada para admitir transformaciones de Cloudinary
    return imageUrl.replace('/upload/', `/upload/c_${crop},w_${width},h_${height}/`);
  }

}
