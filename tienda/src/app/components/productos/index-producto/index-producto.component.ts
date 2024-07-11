import { Component, OnInit } from '@angular/core';
import { NavComponent } from '../../nav/nav.component';
import { FooterComponent } from '../../footer/footer.component';

declare var jQuery:any;
declare var iziToast: { show: (arg0: { title: string; class: string;  titleColor: string; position: string; message: string; }) => void; };
declare var $:any;

declare var noUiSlider:any

@Component({
  selector: 'app-index-producto',
  standalone: true,
  imports: [NavComponent,FooterComponent],
  templateUrl: './index-producto.component.html',
  styleUrl: './index-producto.component.css'
})
export class IndexProductoComponent implements OnInit{

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

}

}
