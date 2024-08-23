export interface Blog {
    titulo: string;
    slug: string;
    categoria: string;
    contenido: string;
    portada: string;
    fecha:string,
    autor:string,
    //variedades: Variedad[];
  }
  /*
  export interface Variedad {
    titulo: string;
    galeria: Imagen[];
    tamano_disponibilidad: TamanoDisponibilidad[];
    _id: string | undefined; // O el tipo correcto para _id
  }
  
  export interface Imagen {
    imagen: string;
    _id: string;
  }
  
  export interface TamanoDisponibilidad {
    unidad_medida: string;
    tamano: string;
    disponibilidad: string;
    precio: number;
    _id: string | undefined; // O el tipo correcto para _id
  }
    */