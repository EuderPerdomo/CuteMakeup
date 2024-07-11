import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { FormGroup, FormsModule, FormControl, Validators } from '@angular/forms';
import { AdminService } from '../../../service/admin.service';
import { CommonModule } from '@angular/common';

declare var iziToast: any;
declare var $: any;

@Component({
  selector: 'app-edit-cliente',
  standalone: true,
  imports: [SidebarComponent, RouterModule, FormsModule, CommonModule],
  templateUrl: './edit-cliente.component.html',
  styleUrl: './edit-cliente.component.css'
})
export class EditClienteComponent implements OnInit {

  public load_btn = false;
  public imgSelect: any | ArrayBuffer = 'assets/img/01.jpg';
  public file: any = undefined;
  public token = localStorage.getItem('token');
  public id = ''
  public load_data = false
  public modificarPassword:boolean=false

  generos = ['', 'Masculino', 'Femenino', 'Otro', 'Prefiero no decirlo'];
  public cliente = {
    nombres: '', apellidos: '', email: '', telefono: '', dni: '', password: '',
    fecha_nacimiento: '', genero: this.generos[0]
  };

  clienteForm!: FormGroup;
  constructor(
    private _adminService: AdminService,
    private _router: Router,
    private _route: ActivatedRoute
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
    this._route.params.subscribe(
      params => {
        this.id = params['id']
        this.load_data = true
        this._adminService.obtener_cliente_admin(this.id, this.token).subscribe(
          response => {
            if (response.data == undefined) {
              this.load_data = false;
            } else {
              this.load_data = false;
              this.cliente = response.data;
            }
          },
          error => {

          }
        )
      },
      error => {

      }
    )
  }
  actualizar(actualizarForm: any) {
    if (actualizarForm.valid) {

      var data: any = {};

      data.nombres = this.cliente.nombres;
      data.apellidos = this.cliente.apellidos;
      data.email = this.cliente.email;
      data.telefono = this.cliente.telefono;
      data.genero = this.cliente.genero;
      data.dni=this.cliente.dni,
      data.fecha_nacimiento=this.cliente.fecha_nacimiento

      if(this.modificarPassword){
        data.password=this.cliente.password
      }

      this.load_btn = true;

      this._adminService.actualizar_cliente_admin(data, this.id, this.token).subscribe(
        response => {
          iziToast.show({
            title: 'SUCCESS',
            titleColor: '#1DC74C',
            color: '#FFF',
            class: 'text-success',
            position: 'topRight',
            message: 'Se actualizó correctamente el cliente.'
          });
          this.load_btn = false;
          this._router.navigate(['/panel/clientes']);
        },
        error => {
          this.load_btn = false;
        }
      )

    } else {
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FF0000',
        color: '#FFF',
        class: 'text-danger',
        position: 'topRight',
        message: 'Los datos del formulario no son validos'
      });
      this.load_btn = false;
    }
  }

}
