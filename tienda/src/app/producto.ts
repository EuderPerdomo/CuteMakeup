export interface Producto {
    titulo:'',
    slug:'',
    galeria:[],
    portada:'',
    precio:any,
    descripcion:'',
    contenido:'',
    stock:any,
    nventas:'',
    npuntos:'',
    variedades:Variedades[],
    categoria:Categoria,
    titulo_variedad:'',
    estado:'',
_id:String,

}

export interface Variedades {
    titulo: '';
    tamano_disponibilidad:Tamano_Disponibilidad[] ;
    galeria:Galeria[],
    _id: String | undefined; // O el tipo correcto para _id
  }


  export interface Categoria {
    titulo: string;
    slug: '';
    _id: String | undefined; // O el tipo correcto para _id
  }

  export interface Galeria {
    imagen: string;
    id: string;
  }
  
  export interface Tamano_Disponibilidad {
    tamano: string,
    unidad_medida: string, 
    disponibilidad: string, 
    precio: string, 
    _id: string
  }