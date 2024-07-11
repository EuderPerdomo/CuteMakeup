import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../service/admin.service';
import { GLOBAL } from '../../../service/GLOBAL';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';

import { Producto, Variedad, Imagen, TamanoDisponibilidad } from '../../../variedad-producto';

declare var jQuery: any;
declare var iziToast: { show: (arg0: { title: string; titleColor: string; class: string; position: string; message: string; }) => void; };
declare var $: any;

@Component({
  selector: 'app-variedad-producto',
  standalone: true,
  imports: [SidebarComponent, FormsModule, CommonModule],
  templateUrl: './variedad-producto.component.html',
  styleUrl: './variedad-producto.component.css'
})
export class VariedadProductoComponent implements OnInit {

  //public producto: any = {}
  public imgSelect: any | ArrayBuffer = 'assets/img/components/noimagen/noimg.PNG';
  public editar_variedad_carcateristica = ''
  //public variedad_en_edicion = undefined
  public variedad_en_edicion: number | undefined = 0;

  public unidad: any
  public file: any = undefined;

  public unidadesMedida = [{
    titulo: 'Metros',
    _id: '1'
  },
  {
    titulo: 'talla',
    _id: '2'
  },
  {
    titulo: 'Gramos',
    _id: '3'
  },
  {
    titulo: 'Miligramos',
    _id: '4'
  },
  ]

  
/*
  public producto:Producto = {
    titulo: '',
    slug: '',
    precio: '',
    descripcion: '',
    portada: '',
    variedades: [{
      galeria:[],
      tamano_disponibilidad:[]
    }
   
    ]
  };*/

  public producto: Producto = {
    titulo: '',
    slug: '',
    precio: '',
    descripcion: '',
    portada: '',
    variedades: [
  /*
      {
        galeria: [], // Galeria vacía
        titulo: 'Lápiz Labial',
        tamano_disponibilidad: [       
        ],
        _id: undefined
      }
  */
    ]
  };
  

  public id: any
  public token: any
  public nueva_variedad = ''
  public load_btn = false
  public url: any

  //public file: File = undefined!


  constructor(
    private _route: ActivatedRoute,
    private _adminService: AdminService,
    private _cdr: ChangeDetectorRef,
  ) {

    this.token = localStorage.getItem('token')
    this.url = GLOBAL.url

    this._route.params.subscribe(
      params => {
        this.id = params['id']
        console.log(this.id)
        this._adminService.obtener_producto_admin(this.id, this.token).subscribe(
          response => {
            if (response.data == undefined) {
              //this.producto = undefined
            } else {
              this.producto = response.data
            }
            console.log(this.producto)
          },
          error => { console.log(error) }
        )
      }


    )


  }

  ngOnInit(): void {

  }

  init_data() {
    console.log('Imagen cargada')
    this._adminService.obtener_producto_admin(this.id, this.token).subscribe(
      response => {
        if (response.data == undefined) {
          //this.producto = undefined
        } else {
          this.producto = response.data
        }
        console.log(this.producto)
      },
      error => { console.log(error) }
    )
  }

  actualizar() {
    console.log('Producto', this.producto)
  }

  eliminar_variedad(idx: any) {

  }

  agregar_variedad() {

  }

  prueba() {
    console.log('ejecuto Prueba')
  }

  addVariety() {

    if (this.variedad_en_edicion == undefined) {
      console.log('Puedo añadir carcateristicas')
    } else {
      console.log('Primero guarde la variedads')
    }
/*
    const newVariety = {
      titulo: 'Nombre Variedad',
      _id: undefined,
      tamano_disponibilidad: [
        { unidad_medida: '', tamano: '', disponibilidad: '', precio: 0 }
      ]
    };
*/

   const newVariety:Variedad = {
      titulo: 'Nombre Variedad',
      _id: undefined,
      galeria:[],
      tamano_disponibilidad: [
        { unidad_medida: '', tamano: '', disponibilidad: '', precio: 0,_id:'' }
      ]
    };

    this.producto.variedades.push(newVariety);

    var longitud = (this.producto.variedades.length) - 1

    this.editar_variedad_carcateristica = "0_0"
    this.editar_variedad_carcateristica = longitud.toString() + "_0"
    console.log('Longitud de variedades', longitud, this.editar_variedad_carcateristica)
    this.variedad_en_edicion = longitud

  }

  addCharacteristic(variety: any, variedad_editando: any) {
    console.log('añadir caracteristica apra:', variedad_editando, variety.tamano_disponibilidad.length)
    if (this.variedad_en_edicion == undefined || variedad_editando == this.variedad_en_edicion) {//Como comparo si le dio editar otra variedad
      //Se actualiza a la nueva variedad en edicion
      this.variedad_en_edicion = variedad_editando //Envia el id de la variedad que se esta editando

      const newCharacteristic = { unidad_medida: '', tamano: '', disponibilidad: '', precio: 0 };
      variety.tamano_disponibilidad.push(newCharacteristic);
      this.editar_variedad_carcateristica = variedad_editando.toString() + '_' + (variety.tamano_disponibilidad.length - 1).toString()
      console.log('Carcteristica', newCharacteristic, this.editar_variedad_carcateristica)

    } else {
      console.log('Primero guarde la vriedads')
    }



  }


  deleteVariety(index: number) {
    this.producto.variedades.splice(index, 1);
  }

  deleteCharacteristic(variety: any, index: number) {
    variety.tamano_disponibilidad.splice(index, 1);
  }

  editarCaracteristica(variedad: any, caracteristica: any) {

    if (this.editar_variedad_carcateristica == '') {
      this.editar_variedad_carcateristica = variedad.toString() + '_' + caracteristica.toString()
      console.log('Editando la variedad', variedad, ' en su caracteristica', caracteristica, 'Validador', this.editar_variedad_carcateristica)
      this.variedad_en_edicion = variedad
    } else {
      console.log('Primero debe guardar los cambios en otras variedades')
    }

  }

  guardarVariedad(variety: any) {

    /*
  
    Especificar los Id Para identificar cada variedad registrada
    asi como las caracteristicas
    */


    // Validar que todas las características estén completas
    console.log('guardar variedad', variety)
    console.log('Pertenecen a la variedad ', this.producto.variedades[variety].tamano_disponibilidad)

    var variedad = this.producto.variedades[variety]

    const isValid = variedad.tamano_disponibilidad.every((characteristic: { unidad_medida: any; tamano: any; disponibilidad: any; precio: any; }) => {
      return characteristic.unidad_medida && characteristic.tamano && characteristic.disponibilidad && characteristic.precio;
    });

    console.log(isValid)


    if (!isValid) {
      alert('Por favor completa todas las características antes de guardar.');
      return;
    }

    this.variedad_en_edicion = undefined
    this.editar_variedad_carcateristica = ''
    console.log('Cuando guarde la variedad debe quedar variedad editando en undefined', this.variedad_en_edicion)

    // Guardar variedad
    this._adminService.agregar_variedad_producto_admin(this.producto.variedades[variety], this.token, this.id).subscribe(
      response => {
        console.log('Variedad guardada', response);
        //variety._id = response._id; // Asignar el ID retornado por el backend a la variedad
      },
      error => {
        console.error('Error al guardar la variedad', error);
      }
    );
  }

  //////////

  fileChangeEvent(event: any): void {
    var file: any;
    if (event.target.files && event.target.files[0]) {
      file = <File>event.target.files[0];
    } else {
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FF0000',
        //color: '#FFF',
        class: 'text-danger',
        position: 'topRight',
        message: 'No hay un imagen de envio'
      });
    }

    if (file.size <= 4000000) {

      if (file.type == 'image/png' || file.type == 'image/webp' || file.type == 'image/jpg' || file.type == 'image/gif' || file.type == 'image/jpeg') {

        const reader = new FileReader();
        reader.onload = e => this.imgSelect = reader.result;
        console.log(this.imgSelect);

        reader.readAsDataURL(file);

        $('#input-portada').text(file.name);
        this.file = file;

      } else {
        iziToast.show({
          title: 'ERROR',
          titleColor: '#FF0000',
          //color: '#FFF',
          class: 'text-danger',
          position: 'topRight',
          message: 'El archivo debe ser una imagen'
        });
        $('#input-portada').text('Seleccionar imagen');
        this.imgSelect = 'assets/img/components/noimagen/noimg.PNG';
        this.file = undefined;
      }
    } else {
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FF0000',
        //color: '#FFF',
        class: 'text-danger',
        position: 'topRight',
        message: 'La imagen no puede superar los 4MB'
      });
      $('#input-portada').text('Seleccionar imagen');
      this.imgSelect = 'assets/img/components/noimagen/noimg.PNG';
      this.file = undefined;
    }

    console.log(this.file);

  }



  subir_imagen(id_variedad: any) {
    if (this.file != undefined) {
      let data = {
        imagen: this.file,
        id_variedad: id_variedad
        //_id:uuidv4()
      }
      console.log(data)
      this._adminService.agregar_imagen_variedad_admin(this.id, data, this.token).subscribe(//antegrior era: agregar_imagen_galeria_admin
        response => {
          //this.init_data()

          const nuevaImagen = response.data.imagen;

          // Encuentra la variedad y añade la nueva imagen
          const variedad = this.producto.variedades.find(v => v._id === id_variedad);
          if (variedad) {
            variedad.galeria!.push(nuevaImagen);
          }

          // Marca para detección de cambios
          this._cdr.detectChanges();

          // Limpia el input de imagen
          this.file = undefined;
          //this.imgSelect='assets/img/components/noimagen/noimg.PNG'
          $('#input_img').val('')
        }
      )
    } else {
      iziToast.show({
        title: 'Error',
        titleColor: 'red',
        class: 'text-danger',
        position: 'topRight',
        message: 'Debe seleccionar una imagen para cargar'
      })
    }
  }


  eliminarImagen(id_imagen:any,id_variedad:any){
console.log('Elimianr,',id_imagen,id_variedad)

this._adminService.eliminar_imagen_variedad_admin(this.id,id_variedad,id_imagen,this.token).subscribe(
  response=>{

    const variedad = this.producto.variedades.find(v => v._id === id_variedad);
          if (variedad) {
            variedad.galeria = variedad.galeria!.filter(img => img._id !== id_imagen);
          }
  },
  error=>{

  }
)

  }
}
