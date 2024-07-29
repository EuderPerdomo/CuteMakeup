import { AfterViewInit, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NavComponent } from '../../nav/nav.component';
import { FooterComponent } from '../../footer/footer.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { GuestService } from '../../../service/guest.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Producto, Galeria } from '../../../producto';

declare var tns: any
declare var lightGallery: any

@Component({
  selector: 'app-show-producto',
  standalone: true,
  imports: [NavComponent, FooterComponent, CommonModule, RouterModule, FormsModule],
  templateUrl: './show-producto.component.html',
  styleUrl: './show-producto.component.css'
})
export class ShowProductoComponent implements AfterViewInit {

  public slug: any
  //public producto: any={}
  //public producto: Producto | undefined;

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

  public galeria: Galeria[] = [];

  public variedad_seleccionada: any
  public galeria_seleccionada: any

  public carrusel: any;
  public carrusel2: any;

  //recomendados
  public productosRecomendados: Array<any> = []

  constructor(
    private _route: ActivatedRoute,
    private _guestService: GuestService,
    private cdr: ChangeDetectorRef,
  ) {


    this._route.params.subscribe(
      params => {
        this.slug = params['slug']
        this._guestService.obtener_producto_public(this.slug).subscribe(
          response => {
            console.log(response.data)

            this.producto = response.data

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

}
