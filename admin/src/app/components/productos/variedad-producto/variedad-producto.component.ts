import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../service/admin.service';
import { GLOBAL } from '../../../service/GLOBAL';
import { CommonModule, NgFor } from '@angular/common';
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
  public variedad_en_edicion: number | undefined = 100; //Inicialmente era 0

  public unidad: any
  public file: any = undefined;

  public unidadesMedida = [{
    titulo: 'Metros',
    _id: '1'
  },
  {
    titulo: 'Talla',
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
  {
    titulo:'Mililitro',
    _id:'5'
  }
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

  public nuevaVariedad2= {};

  public nuevaVariedad:Variedad = {
    titulo: 'Nombre Variedad',
    _id: undefined,
    galeria:[],
    tamano_disponibilidad: [
     // { unidad_medida: 'dsd', tamano: 'sd', disponibilidad: '', precio: 0,_id:'' }
    ]
  };


  //Formulario Inicial
public unidad_medida0=''
public tamano0=''
public precio0=0
public disponibilidad0=0
public titulo=''
public a = 0;
public tamano_disponibilidad: Array<any> = [];
public editando = false
public codigo = 0
  

  public id: any
  public token: any
  public nueva_variedad = ''
  public load_btn = false
  public url: any

  //Editando o creando nueva carcateristica
  public accion=''

  

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
     this.init_data()
      }
    )
  }

  ngOnInit(): void {

  }

  init_data() {
    this._adminService.obtener_producto_admin(this.id, this.token).subscribe(
      response => {
        if (response.data == undefined) {
          //this.producto = undefined
        } else {
          this.producto = response.data
        }
      },
      error => { console.log(error) }
    )
  }



/*
  addVariety() {

    if (this.variedad_en_edicion == undefined) {
      console.log('Puedo añadir carcateristicas')
    } else {
      console.log('Primero guarde la variedads')
    }


   const newVariety:Variedad = {
      titulo: 'Nombre Variedad',
      _id: undefined,
      galeria:[],
      tamano_disponibilidad: [
        { unidad_medida: '', tamano: '', disponibilidad: '', precio: 0,_id:undefined }
      ]
    };

    this.producto.variedades.push(newVariety);

    var longitud = (this.producto.variedades.length) - 1

    this.editar_variedad_carcateristica = "0_0"
    this.editar_variedad_carcateristica = longitud.toString() + "_0"
    console.log('Longitud de variedades', longitud, this.editar_variedad_carcateristica)
    this.variedad_en_edicion = longitud

  }
  */

/*
  addCharacteristic(variety: any, variedad_editando: any) {
    console.log('añadir caracteristica apra:', variety,variedad_editando, variety.tamano_disponibilidad.length)
    console.log('Primero guarde la vriedads', this.variedad_en_edicion, '///////',this,variedad_editando)
    if (this.variedad_en_edicion == undefined || variedad_editando == this.variedad_en_edicion) {//Como comparo si le dio editar otra variedad
      //Se actualiza a la nueva variedad en edicion
      this.variedad_en_edicion = variedad_editando //Envia el id de la variedad que se esta editando

      const newCharacteristic = { unidad_medida: '', tamano: '', disponibilidad: '', precio: 0 };
      variety.tamano_disponibilidad.push(newCharacteristic);
      this.editar_variedad_carcateristica = variedad_editando.toString() + '_' + (variety.tamano_disponibilidad.length - 1).toString()
      console.log('Carcteristica', newCharacteristic, this.editar_variedad_carcateristica)

    } else {
      console.log('Primero guarde la vriedads', this.variedad_en_edicion, '///////',this,variedad_editando)
    }
  }
*/

  deleteVariety(index: number) {
    this.producto.variedades.splice(index, 1);
  }

  deleteCharacteristic(variety: any, index: number) {
    variety.tamano_disponibilidad.splice(index, 1);
  }

  editarCaracteristica(variedad: any, caracteristica: any) {
    this.accion='editar'
    console.log('carcateristica en edicion',variedad.toString() + '_' + caracteristica.toString())
    if (this.editar_variedad_carcateristica == '') {
      this.editar_variedad_carcateristica = variedad.toString() + '_' + caracteristica.toString()
      console.log('Editando la variedad', variedad, ' en su caracteristica', caracteristica, 'Validador', this.editar_variedad_carcateristica)
      this.variedad_en_edicion = variedad
    } else {
      iziToast.show({
        title: '¡Atención!',
        titleColor: '#ff0000',
        class: 'text-warning',
        position: 'topRight',
        message: '🔧 Por favor, guarda los cambios en la variedad actual antes de pasar a otra. ¡La precisión es clave! 💾✨'
    });
    }
  }

  cancelarEditarCaracteristica(variedad: any, caracteristica: any){
this.accion=''
this.editar_variedad_carcateristica = ''
this.variedad_en_edicion=100
  }



  guardarVariedad(variety: any) {

    /*
  
    Especificar los Id Para identificar cada variedad registrada
    asi como las caracteristicas
    */


    // Validar que todas las características estén completas
    console.log('guardar variedad', this.producto.variedades[variety])
    console.log('Pertenecen a la variedad ', this.producto.variedades[variety].tamano_disponibilidad)

    var variedad = this.producto.variedades[variety]

    const isValid = variedad.tamano_disponibilidad.every((characteristic: { unidad_medida: any; tamano: any; disponibilidad: any; precio: any; }) => {
      return characteristic.unidad_medida && characteristic.tamano && characteristic.disponibilidad && characteristic.precio;
    });

    console.log(isValid)

    if (!isValid) {

      iziToast.show({
        title: '¡Ups!',
        titleColor: 'red',
        class: 'text-danger',
        position: 'topRight',
        message: '🤔 Aún faltan detalles por completar, No olvides completar todas las características antes de guardar tu trabajo.'
      })

      return;
    }

    this.variedad_en_edicion = undefined
    this.editar_variedad_carcateristica = ''




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
      this.load_btn=true
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
          this.load_btn=false
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
console.log('Eliminar,',id_imagen,id_variedad)

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


  variedadNueva(variedadNuevaForm:any){

  }

  anadirCaracteristicaNuevaVariedad(variety: any, variedad_editando: any) {

    console.log('añadir carcateristica para nueva variedad',this.nuevaVariedad)

    //Vvalidar si ya tiene

    const newCharacteristic = { unidad_medida: '', tamano: '', disponibilidad: '', precio: 0,_id:'' };
    this.nuevaVariedad.tamano_disponibilidad.push(newCharacteristic);
console.log('Asi va quedaando',this.nuevaVariedad)
  }

  addCampo() {

    const data = {
      codigo: this.a,
      unidad_medida: this.unidad_medida0,
      tamano: this.tamano0,
      disponibilidad: this.disponibilidad0,
      precio: this.precio0,
    }
    this.a = this.a + 1
    this.tamano_disponibilidad.push(data)

    //this.limpiarCampos()
console.log(this.tamano_disponibilidad)
  }

  editarFila(item: { codigo: number; unidad_medida: string; tamano: string; disponibilidad: number; precio: number}) {
    this.editando = true
    this.codigo = item.codigo
    this.unidad_medida0 = item.unidad_medida
    this.tamano0 = item.tamano
    this.disponibilidad0 = item.disponibilidad
    this.precio0 = item.precio

  }

  borrar(codigo: number) {
    for (let x = 0; x < this.tamano_disponibilidad.length; x++)
      if (this.tamano_disponibilidad[x].codigo == codigo) {
        this.tamano_disponibilidad.splice(x, 1);
        return;
      }
  }

  
  guardarEditarCampo() {

    for (let x = 0; x < this.tamano_disponibilidad.length; x++)
      if (this.tamano_disponibilidad[x].codigo == this.codigo) {
        this.tamano_disponibilidad[x].codigo = this.codigo
        this.tamano_disponibilidad[x].tamano = this.tamano0
        this.tamano_disponibilidad[x].unidad_medida = this.unidad_medida0
        this.tamano_disponibilidad[x].disponibilidad = this.disponibilidad0
        this.tamano_disponibilidad[x].precio = this.precio0
        this.editando = false
        return;
      }
  }

guardarNuevaVariedad() {
  if (!this.titulo) {
    iziToast.show({
      title: '¡Ups!',
      titleColor: 'red',
      class: 'text-danger',
      position: 'topRight',
      message: '🤔No olvides Añadir un titulo para la variedad'
    });
  } else {
    // Eliminar el campo 'codigo' de cada objeto en 'tamano_disponibilidad'
    const variety = this.tamano_disponibilidad.map(({ codigo, ...resto }) => resto);

    const variedad = {
      titulo: this.titulo,
      tamano_disponibilidad: variety
    };

    // Validar que todas las características estén completas y no vacías
    const isValid = variedad.tamano_disponibilidad.length > 0 && 
    variedad.tamano_disponibilidad.every(caracteristica => {
      return caracteristica.unidad_medida?.trim() !== '' &&
             caracteristica.tamano?.trim() !== '' &&
             caracteristica.disponibilidad !== null &&
             caracteristica.disponibilidad !== undefined &&
             caracteristica.precio !== null &&
             caracteristica.precio !== undefined;
    });

    if (!isValid) {
      iziToast.show({
        title: '¡Ups!',
        titleColor: 'red',
        class: 'text-danger',
        position: 'topRight',
        message: '🤔 Aún faltan detalles por completar, No olvides completar todas las características antes de guardar tu trabajo.'
      });
    } else {

      this._adminService.agregar_nueva_variedad_producto_admin(variedad, this.token, this.id).subscribe(
        response => {
          this.init_data();
          $('#anadirVariedad').modal('hide');
          $('.modal-backdrop').remove();
          this.tamano_disponibilidad=[]//Dejamos el arreglo vacio
        },
        error => {
          console.error('Error al guardar la variedad', error);
        }
      );
    }
  }
}

//Caracteristicas

addCaracteristica(variety: any, variedad_editando: any) {
this.accion='nuevo'

 //console.log('añadir caracteristica apra:', variety,variedad_editando, variety.tamano_disponibilidad.length)
  //console.log('Primero guarde la vriedads', this.variedad_en_edicion, '///////',this,variedad_editando)

  //this.variedad_en_edicion = variedad_editando //Envia el id de la variedad que se esta editando
  const newCharacteristic = { unidad_medida: '', tamano: '', disponibilidad: '', precio: 0 };
  variety.tamano_disponibilidad.push(newCharacteristic);
  
  this.editar_variedad_carcateristica = variedad_editando.toString() + '_' + (variety.tamano_disponibilidad.length - 1).toString()
 //console.log('Carcteristica', newCharacteristic, this.editar_variedad_carcateristica)


/*

  if (this.variedad_en_edicion == undefined || variedad_editando == this.variedad_en_edicion) {//Como comparo si le dio editar otra variedad
    //Se actualiza a la nueva variedad en edicion
    this.variedad_en_edicion = variedad_editando //Envia el id de la variedad que se esta editando
    const newCharacteristic = { unidad_medida: '', tamano: '', disponibilidad: '', precio: 0 };
    variety.tamano_disponibilidad.push(newCharacteristic);
    this.editar_variedad_carcateristica = variedad_editando.toString() + '_' + (variety.tamano_disponibilidad.length - 1).toString()
    console.log('Carcteristica', newCharacteristic, this.editar_variedad_carcateristica)

  } else {
    console.log('Primero guarde la vriedads', this.variedad_en_edicion, '///////',this,variedad_editando)
  }

  */
}

guardarNuevaCaracteristica(indice:any,indice2:any,variety:any){
console.log('Campos a verificar:',indice,indice2)
const caracteristica = {
  unidad_medida: variety.tamano_disponibilidad[indice2].unidad_medida,
  tamano: variety.tamano_disponibilidad[indice2].tamano,
  disponibilidad:variety.tamano_disponibilidad[indice2].disponibilidad,
  precio:variety.tamano_disponibilidad[indice2].precio
};

//Validamos valides de los campos
const isValid =  caracteristica.unidad_medida?.trim() !== '' &&
         caracteristica.tamano?.trim() !== '' &&
         caracteristica.disponibilidad !== null &&
         caracteristica.disponibilidad !== undefined &&
         caracteristica.precio !== null &&
         caracteristica.precio !== undefined;

if(isValid){

  this._adminService.agregar_nueva_caracteristica_variedad_admin(this.id,variety._id,caracteristica,this.token).subscribe(
    response=>{   
      iziToast.show({
        title: '¡Genial!',
        titleColor: 'green',
        class: 'text-success',
        position: 'topRight',
        message: '👌Caracteristica agregada correctamente'
      });
      this.init_data()
    }
    
  )
  console.log('Caracteristica a guardar.',variety.tamano_disponibilidad[indice2],'id de variedad:',variety._id,'Producto',this.id)

}else{
  iziToast.show({
    title: '¡Ups!',
    titleColor: 'red',
    class: 'text-danger',
    position: 'topRight',
    message: '🤔 Aún faltan detalles por completar, No olvides completar todas las campos antes de guardar.'
  });
}

}


guardarEditarCaracteristica(variedad: any, carcateristic: any,variety:any,item:any){
  console.log('guardar editar caracteristica',variedad,carcateristic,variety)

  console.log('item',item)
  const id_caracteristica= variety._id
  const id_variedad=item._id


const caracteristica = {
  unidad_medida: variety.unidad_medida,
  tamano: variety.tamano,
  disponibilidad:variety.disponibilidad,
  precio:variety.precio,
};

//Validamos valides de los campos
const isValid =  caracteristica.unidad_medida?.trim() !== '' &&
         caracteristica.tamano?.trim() !== '' &&
         caracteristica.disponibilidad !== null &&
         caracteristica.disponibilidad !== undefined &&
         caracteristica.precio !== null &&
         caracteristica.precio !== undefined;
  
      
        if(isValid){
          
          this._adminService.editar_caracteristica_variedad_admin(this.id,id_variedad,id_caracteristica,caracteristica,this.token).subscribe(
            response=>{   
              iziToast.show({
                title: '¡Genial!',
                titleColor: 'green',
                class: 'text-success',
                position: 'topRight',
                message: '👌Caracteristica Editada correctamente'
              });
              this.init_data()
              
              this.accion=''
              this.editar_variedad_carcateristica = ''
              this.variedad_en_edicion=100

            }
            
          )

          
        }else{
          iziToast.show({
            title: '¡Ups!',
            titleColor: 'red',
            class: 'text-danger',
            position: 'topRight',
            message: '🤔 Aún faltan detalles por completar, No olvides completar todas las campos antes de guardar.'
          });
        }

}





}