import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { ReactiveFormsModule, Validators, FormGroup, FormControl } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AdminService } from '../../../service/admin.service';
import { RouterModule } from '@angular/router';

declare var iziToast: any;
declare var $: any;

@Component({
  selector: 'app-create-cliente',
  standalone: true,
  imports: [SidebarComponent, ReactiveFormsModule, FormsModule, CommonModule, RouterModule],
  templateUrl: './create-cliente.component.html',
  styleUrl: './create-cliente.component.css'
})
export class CreateClienteComponent implements OnInit {


  generos = ['', 'Masculino', 'Femenino', 'Otro', 'Prefiero no decirlo'];
  cliente = {
    nombres: '', apellidos: '', email: '', telefono: '', dni: '', password: '',
    fecha_nacimiento: '', genero: this.generos[0]
  };
  clienteForm!: FormGroup;

  public load_btn = false;
  public imgSelect: any | ArrayBuffer = 'assets/img/01.jpg';
  public file: any = undefined;
  public token = localStorage.getItem('token');

  constructor(
    private _adminService: AdminService,
    private _router: Router
  ) {
    this.clienteForm = new FormGroup({
      nombres: new FormControl(this.cliente.nombres, [
        Validators.required,
        Validators.minLength(4),
        //forbiddenNameValidator(/bob/i), // <-- Here's how you pass in the custom validator.
      ]),
      apellidos: new FormControl(this.cliente.apellidos, [
        Validators.required,
        Validators.minLength(4),

      ]),
      email: new FormControl(this.cliente.email, [
        Validators.required,
        Validators.email,
      ]),

      telefono: new FormControl(this.cliente.telefono, [
        Validators.required,

      ]),

      dni: new FormControl(this.cliente.dni, [
        Validators.required,
      ]),
      password: new FormControl(this.cliente.password, [
        Validators.required,
      ]),
      fecha_nacimiento: new FormControl(this.cliente.fecha_nacimiento, [
        Validators.required,
      ]),
      // role: new FormControl(this.actor.role),
      genero: new FormControl(this.cliente.genero, Validators.required),
    });

  }

  ngOnInit(): void {
  }

  // registro1(registroForm: any) {
  //   console.log('Registro')
  //   if (registroForm.valid) {
  //     // this.load_btn = true;

  //     this._adminService.registro_cliente_admin(this.cliente, this.token).subscribe(
  //       response => {


  //         console.log('Respuesta Obtenida', response.data)

  //         if (response.data == undefined) {
  //           iziToast.show({
  //             title: 'ERROR',
  //             titleColor: '#FF0000',
  //             color: '#FFF',
  //             class: 'text-danger',
  //             position: 'topRight',
  //             message: response.message
  //           });
  //           // this.load_btn = false;
  //         } else {
  //           iziToast.show({
  //             title: 'SUCCESS',
  //             titleColor: '#1DC74C',
  //             color: '#FFF',
  //             class: 'text-success',
  //             position: 'topRight',
  //             message: 'Se registro correctamente el nuevo Cliente.'
  //           });
  //           //this.load_btn = false;

  //           this._router.navigate(['/clientes']);
  //         }
  //       },
  //       error => {
  //         // this.load_btn = false;
  //       }
  //     );

  //     //this.load_btn = false;


  //   } else {

  //     iziToast.show({
  //       title: 'ERROR',
  //       titleColor: '#FF0000',
  //       color: '#FFF',
  //       class: 'text-danger',
  //       position: 'topRight',
  //       message: 'Los datos del formulario no son validos'
  //     });
  //     this.load_btn = false;


  //   }
  // }


  registro(registroForm: any) {
    if (registroForm.valid) {
       this.load_btn = true;
      this._adminService.registro_cliente_admin(this.cliente, this.token).subscribe(
        response => {

          if (response.status === 201) { // Creacción exitosa retorna 201
            iziToast.show({
              title: 'SUCCESS',
              titleColor: '#1DC74C',
              color: '#FFF',
              class: 'text-success',
              position: 'topRight',
              message: 'Se registró correctamente el nuevo Cliente.'
            });
            this.load_btn = false;
            this._router.navigate(['/panel/clientes']);
          } else if (response.status === 400) { // Bad request, faltan campos
            iziToast.show({
              title: 'ERROR',
              titleColor: '#FF0000',
              color: '#FFF',
              class: 'text-danger',
              position: 'topRight',
              message: response.message || 'Solicitud incorrecta.'
            });
            this.load_btn = false;
          } else if (response.status === 409) { // Conflicto por datos duplicados
            iziToast.show({
              title: 'ERROR',
              titleColor: '#FF0000',
              color: '#FFF',
              class: 'text-danger',
              position: 'topRight',
              message: response.message || 'El correo ya existe, intente con otro.'
            });
            this.load_btn = false;
          } else {
            // Errores Inesperados
            iziToast.show({
              title: 'ERROR',
              titleColor: '#FF0000',
              color: '#FFF',
              class: 'text-danger',
              position: 'topRight',
              message: response.message || 'Ocurrió un error inesperado.'
            });
            this.load_btn = false;
          }
        },
        error => {
          console.error('Error en la solicitud', error);
          iziToast.show({
            title: 'ERROR',
            titleColor: '#FF0000',
            color: '#FFF',
            class: 'text-danger',
            position: 'topRight',
            message: 'Error en el servidor. Por favor, intente más tarde.' //'Error en el servidor. Por favor, intente más tarde.'
          });
          this.load_btn = false;
        }
      );

       this.load_btn = false;

    } else {
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FF0000',
        color: '#FFF',
        class: 'text-danger',
        position: 'topRight',
        message: 'Los datos del formulario no son válidos'
      });
      this.load_btn = false;
    }
  }


  /*
  get nombre() {
    return this.clienteForm.get('nombre');
  }
  get email() {
    console.log(this.clienteForm.get('correo'))
    return this.clienteForm.get('email');
  }

  get skill() {
    return this.actorForm.get('skill');
  }
*/

}
