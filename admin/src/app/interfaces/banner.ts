export interface Banner {
    titulo: string;
    _id: String | undefined;
    galeria:Galeria[],
  }

  export interface Galeria {
    titulo: string;
    subtitulo:String,
    tituloBoton:String,
    enlace:String,
    imagen:String,
    _id: String | undefined;
  }