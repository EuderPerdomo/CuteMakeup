import { Component } from '@angular/core';
import { AdminService } from '../../service/admin.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

declare var jQuery:any
declare var $:any
declare var iziToast:any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  public token : any = '';
  public admin = {
    email :'',
    password: ''
  }


  constructor(
    private _adminService:AdminService,
    private _router:Router
  ) { 
    this.token =localStorage.getItem('token');
  }


  ngOnInit(): void {
    $('body').addClass('align-items-center');
    if(this.token){
      this._router.navigate(['']);
    }else{
      //MANTENER EN EL COMPONENTE
    }
  }

  
  login(loginForm:any){
    
    if(loginForm.valid){
      let email = loginForm.value.email;
      let password = loginForm.value.password;
console.log(email,password)
      if(email == '' && password == ''){
        iziToast.show({
          title: 'ERROR DATA',
          class:'iziToast-danger',
          position: 'topRight',
          message: 'Todos los campos son requeridos, vuelva a intentar.'
        });
      }else{
        //this._adminService.login_admin({email,password}).subscribe()
        this._adminService.login_admin({email,password}).subscribe(
          response =>{
            console.log(response);
            
            if(response.data != null){
              this.token = response.jwt;
              localStorage.setItem('token',response.token);
              localStorage.setItem('identity',response.data._id);
              localStorage.setItem('user_data',JSON.stringify(response.data));
              this._router.navigate(['']);
            }else{
              iziToast.show({
                  title: 'ERROR USER',
                  class:'iziToast-danger',
                  position: 'topRight',
                  message: response.message
              });
            }
            
          },
          error=>{
            iziToast.show({
                title: 'ERROR SERVER',
                class:'iziToast-danger',
                position: 'topRight',
                message: 'Ocurrió un error en el servidor, intente mas nuevamente.'
            });
          }
        );
      }
    }else{
      iziToast.show({
          title: 'ERROR DATA',
          class:'iziToast-danger',
          position: 'topRight',
          message: 'Complete correctamente el formulario.'
      });
    }
  }


  view_password(){
    console.log('ver contraseña')
    let type = $('#password').attr('type');
    if(type == 'text'){
      $('#password').attr('type','password');
      
    }else if(type == 'password'){
      $('#password').attr('type','text');
    }
  }




}
