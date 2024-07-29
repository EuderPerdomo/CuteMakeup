export interface Producto {
    titulo:'',
    slug:'',
    galeria:[],
    portada:'',
    precio:'',
    descripcion:'',
    contenido:'',
    stock:'',
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
    tamano_disponibilidad: '';
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