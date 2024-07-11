import { Component } from '@angular/core';
import { NavComponent } from '../../nav/nav.component';
import { FooterComponent } from '../../footer/footer.component';
import {Cliente} from '../../../../app/cliente'
import { CommonModule } from '@angular/common';
import { ClienteService } from '../../../service/cliente.service';

@Component({
  selector: 'app-cuenta',
  standalone: true,
  imports: [NavComponent,FooterComponent,CommonModule],
  templateUrl: './cuenta.component.html',
  styleUrl: './cuenta.component.css'
})
export class CuentaComponent {

  public token: any = '';
  public user_login: Cliente | undefined;
  
public cliente : any= {}


constructor(
  private _clienteService:ClienteService,
){

  this.token = localStorage.getItem('token');

  if (this.token) {
    let obj_lc: any = localStorage.getItem('user_data');
    this.user_login = JSON.parse(obj_lc);
    console.log('Usuario actual',this.user_login)

    this._clienteService.obtener_cliente_guest(this.user_login?._id,this.token).subscribe(
      response=>{console.log(response)
      this.cliente=response.data
      }
    )


  }

}


}
