import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FooterComponent } from '../../footer/footer.component';
import { NavComponent } from '../../nav/nav.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GuestService } from '../../../service/guest.service';
import { CommonModule } from '@angular/common';
import { ClienteService } from '../../../service/cliente.service';

declare var $:any
declare var iziToast: { show: (arg0: { title: string; class: string; titleColor: string; position: string; message: string; }) => void; };


@Component({
  selector: 'app-direcciones',
  standalone: true,
  imports: [SidebarComponent,FooterComponent,NavComponent,RouterModule,FormsModule, CommonModule],
  templateUrl: './direcciones.component.html',
  styleUrl: './direcciones.component.css'
})
export class DireccionesComponent {
public direccion:any={
  pais:'',
  region:'',
  departamento:'',
  municipio:'',
  principal:false,
}
public token:any

public regiones:Array<any>=[]
public departamentos:Array<any>=[]
public municipios:Array<any>=[]

public regiones_arr:Array<any>=[]
public departamentos_arr:Array<any>=[]
public municipios_arr:Array<any>=[]

public direcciones:Array<any>=[]

public load_data=true
public op = 1;

constructor(
  private _guestService:GuestService,
  private _clienteService:ClienteService,
){
  this.token=localStorage.getItem('token')

  this._guestService.get_regiones().subscribe(
    response=>{
      this.regiones_arr=response
    }
  )


  this._guestService.get_departamentos().subscribe(
    response=>{
      this.departamentos_arr = response;
    }
  );

  this._guestService.get_municipios().subscribe(
    response=>{
      this.municipios_arr = response;
    }
  );


}

ngOnInit(){
  this.obtener_direcciones()
}

select_pais(){
  if(this.direccion.pais=='Colombia'){
    $('#sl-region').prop('disabled',false)

    this._guestService.get_regiones().subscribe(
      response=>{
        response.forEach((element: any)=>{
          this.regiones.push({
            _id:element.ID,
            name:element.REGION
          })
        })
      }
    )
  }else{
    $('#sl-region').prop('disabled',true)
    $('#sl-departamento').prop('disabled',true)
    this.regiones=[]
    this.departamentos=[]

    this.direccion.region=''
    this.direccion.departamento=''
  }
}


select_region(){
  this.departamentos=[]
  $('#sl_departamento').prop('disabled',false)
  $('#sl_municipio').prop('disabled',true)
  this.direccion.municipio=''
   this.direccion.departamento=''
  this._guestService.get_departamentos().subscribe(
    response=>{
      response.forEach((element: any)=>{

if(element.ID_REGION==this.direccion.region){

  this.departamentos.push({
    _id:element.ID,
    name:element.DEPARTAMENTO,
    id_region:element.ID_REGION
  })

}
      })
    }
  )


}


select_departamento(){
  this.municipios=[]
  $('#sl_municipio').prop('disabled',false)
  this.direccion.municipio=''
  this._guestService.get_municipios().subscribe(
    response=>{
      response.forEach((element: any)=>{

if(element.ID_DEPARTAMENTO==this.direccion.departamento){

  this.municipios.push({
    _id:element.ID,
    name:element.MUNICIPIO,
    id_region:element.ID_REGION,
    id_departamento:element.ID_DEPARTAMENTO,
  })

}
      })

    }
  )

}


registrarDireccion(registroForm:any){



  if(registroForm.valid){

    this.regiones_arr.forEach((element: {ID:any,REGION:any}) =>{
      if(parseInt(element.ID)==parseInt(this.direccion.region)){
       this.direccion.region=element.REGION
      }
   })


  this.departamentos_arr.forEach((element: {ID:any,DEPARTAMENTO:any}) =>{
    if(parseInt(element.ID)==parseInt(this.direccion.departamento)){
     this.direccion.departamento=element.DEPARTAMENTO
    }
  })
  
  this.municipios_arr.forEach((element: {ID:any,MUNICIPIO:any}) =>{
    if(parseInt(element.ID)==parseInt(this.direccion.municipio)){
     this.direccion.municipio=element.MUNICIPIO
    }
  })
  
  let data={
    destinatario:this.direccion.destinatario,
    dni:this.direccion.dni,
    direccion:this.direccion.direccion,
    telefono:this.direccion.telefono,
    pais:this.direccion.pais,
    region:this.direccion.region,
    departamento:this.direccion.departamento,
    municipio:this.direccion.municipio,
    principal:this.direccion.principal,
    cliente:localStorage.getItem('identity')
  }

  this._clienteService.registro_direccion_cliente(data,this.token).subscribe(
    response=>{
      this.direccion={
        pais:'',
        region:'',
        departamento:'',
        municipio:'',
        principal:false,
      
      }
      $('#sl-region').prop('disabled',true)
      $('#sl-provincia').prop('disabled',true)
      $('#sl-distrito').prop('disabled',true)
    
      iziToast.show({
        title:'SUCCESS',
        titleColor:'#1DC74C',
        class:'text-succes',
        position:'topRight',
        message: '🏠 ¡Dirección guardada con éxito! ¡Tu próximo pedido ya tiene destino! 📦🎉'
      })
    this.obtener_direcciones()
    }
  )
  
  }else{
    iziToast.show({
      title: '¡Oops!',
      titleColor: '#FF0000',
      class: 'text-danger',
      position: 'topRight',
       message: '⚠️ Algo no cuadra. Revisa los campos y vuelve a intentarlo. 💪✨'

    });
  }

}

obtener_direcciones(){

  this._clienteService.obtener_direccion_todos_cliente(localStorage.getItem('identity'),this.token).subscribe(
    response=>{
      this.direcciones=response.data
      this.load_data=false
    }
  )
    
}


establecer_principal(id:any){
  this._clienteService.cambiar_direccion_principal_cliente(id,localStorage.getItem('identity'),this.token).subscribe(
    response=>{

      iziToast.show({
        title:'SUCCESS',
        titleColor:'#1DC74C',
        class:'text-succes',
        position:'topRight',
        message:'Dirección Actualizada Correctamente'
      })
this.obtener_direcciones()
    }
  )
}



eliminar(id:any){
  this._clienteService.eliminar_direccion_cliente(id,this.token).subscribe(
    response=>{
      iziToast.show({
          title: 'SUCCESS',
          titleColor: '#1DC74C',
          class: 'text-success',
          position: 'topRight',
          message: 'Se eliminó la dirección correctamente.'
      });
      this.obtener_direcciones();
      
    },
    error=>{
      console.log(error);
      
    }
  )
}

changeOp(op:any){
  this.op = op;
}

}
