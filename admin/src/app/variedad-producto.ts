/*
export interface Producto {
    titulo: String,
    slug: String,
    precio: String,
    descripcion: String,
    portada: String,
    variedades:Variedad[];
}

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

  export interface Producto {
    titulo: string;
    slug: string;
    precio: string;
    descripcion: string;
    portada: string;
    variedades: Variedad[];
    _id: string | undefined;
  }
  
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