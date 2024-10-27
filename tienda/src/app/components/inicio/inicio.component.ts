import { AfterViewInit, Component, OnInit } from '@angular/core';
import { NavComponent } from '../nav/nav.component';
import { FooterComponent } from '../footer/footer.component';
import { RouterModule } from '@angular/router';
import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'; //Agregado para splineviewer
import { ClienteService } from '../../service/cliente.service';
import { CommonModule } from '@angular/common';

declare var tns:any

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [NavComponent,FooterComponent,RouterModule,CommonModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css',
  schemas:[CUSTOM_ELEMENTS_SCHEMA]//Agregado para splineViewer
})
export class InicioComponent implements OnInit, AfterViewInit {

  public categorias:Array<any>=[]
public categoriasCarga=false

constructor(
  private _clienteService:ClienteService
){
  this.categoriasCarga=true
  this._clienteService.get_categorias_publico().subscribe(
    response => {
      this.categorias = response.data;
      this.categoriasCarga=false
    }
  );
}


iniciarCategorias(){
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
  
}


ngAfterViewInit(): void {
  
  tns({  
    container: '.tns-carousel-inner',
    controlsText: ['<i class="ci-arrow-left"></i>', '<i class="ci-arrow-right"></i>'],
    mode: 'gallery',
    navContainer: '#pager',
    responsive: {
      0: { controls: false },
      991: { controls: true }
    }
  });
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
    
  });

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
  })

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
  container:".tns-carousel-inner-six",
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
  container:".tns-carousel-inner-seven",
  controls: false,
  gutter: 15,
  responsive: {
    "0": { "items": 2 },
    "500": { "items": 3 },
    "1200": { "items": 3 }
  }
})


tns({
  container:".tns-carousel-inner-eight",
  controls: false,
  gutter: 30,
  responsive: {
    "0": { "items": 1 },
    "576": { "items": 2 }
  }
})

tns({
  container:".tns-carousel-inner-nine",
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

    setTimeout(()=>{
      this.iniciarCategorias()
    },1000);
}

  login(){
    console.log('login')
  }
}
