import { Component } from '@angular/core';
import { NavComponent } from '../nav/nav.component';
import { FooterComponent } from '../footer/footer.component';
import { ClienteService } from '../../service/cliente.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { GuestService } from '../../service/guest.service';

declare var $: any
declare var tns: any
declare var iziToast: { show: (arg0: { title: string; class: string; titleColor: string; position: string; message: string; }) => void; };


@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [NavComponent,FooterComponent, CommonModule, FormsModule, RouterModule],
  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.css'
})
export class ContactoComponent {

  public contacto: any={}
  public load_btn=false
    constructor(
      private _guestService:GuestService
    ) { }
  
    ngOnInit(): void {
    }
  
  registro(registroForm:any){
    if(registroForm.valid){
  this.load_btn=true
  this._guestService.enviar_mensaje_contacto(this.contacto).subscribe(
    response=>{
      console.log(response)
  
      iziToast.show({
        title:'¡Listo!',
        titleColor:'#1DC74C',
        class:'text-success',
        position:'topRight',
        message:'✨ Tu mensaje ya está en camino. Nos comunicaremos contigo pronto. ✨'
      })
  
  this.contacto={}
  this.load_btn=false
    }
  )
    }else{
      iziToast.show({
        title:'¡Ups!',
        titleColor:'red',
        class:'text-danger',
        position:'topRight',
        message:'🔍 Algo no encaja. Por favor, revisa los datos antes de enviarlos. 😉' 
      })
    }
  }


}
