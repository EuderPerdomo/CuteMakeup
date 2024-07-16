import { Component, OnInit } from '@angular/core';
import { NavComponent } from '../../nav/nav.component';
import { FooterComponent } from '../../footer/footer.component';
import { ClienteService } from '../../../service/cliente.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

declare var jQuery:any;
declare var iziToast: { show: (arg0: { title: string; class: string;  titleColor: string; position: string; message: string; }) => void; };
declare var $:any;

declare var noUiSlider:any

@Component({
  selector: 'app-index-producto',
  standalone: true,
  imports: [NavComponent,FooterComponent,CommonModule,FormsModule],
  templateUrl: './index-producto.component.html',
  styleUrl: './index-producto.component.css'
})
export class IndexProductoComponent implements OnInit{

  public categorias: Array<any> = [];
  public filtrar_categoria=''
  public productos:Array<any>=[]
  public filtro_producto=''


  //Precargador
  public load_data=true



  constructor(
    private _clienteService:ClienteService,
  ){

  }

ngOnInit(): void {

  var slider : any = document.getElementById('slider');

  noUiSlider.create(slider, {
      start: [0, 25000],
      connect: true,
      range: {
          'min': 0,
          'max': 150000
      },
      tooltips: [true,true],
      pips: {
        mode: 'count', 
        values: 5,     
      },
  })

  slider.noUiSlider.on('update', function (values:any) {

      $('.range-slider-value-min').val(values[0]);
      $('.range-slider-value-max').val(values[1]);
  });
  $('.noUi-tooltip').css('font-size','11px');


/*Iniciamos obtencion de las categorias */
this._clienteService.get_categorias_publico().subscribe(
  response=>{
    this.categorias = response.data;
    console.log('categorias',this.categorias)
  }
);

/*Listamos los productos*/

this._clienteService.listar_productos_public(this.filtro_producto).subscribe(
  response=>{
this.productos=response.data
console.log(this.productos)
this.load_data=false
  },
  error=>{

  }
)

}

buscar_categoria(){
  console.log(this.filtrar_categoria)
  if(this.filtrar_categoria){
var search=new RegExp(this.filtrar_categoria,'i')
this.categorias=this.categorias.filter(
  item=>search.test(item.titulo)
)
  }else{
    this._clienteService.get_categorias_publico().subscribe(
      response=>{
        this.categorias = response.data;
        console.log('categorias',this.categorias)
      }
    );
  }
}

}
