'use strict'

var mongoose=require('mongoose')
var Schema=mongoose.Schema

var variedadesSchema = new mongoose.Schema({
    titulo: {type:String,required:false},
    galeria:[{
        imagen:{type:String, required:false},
    }],
    tamano_disponibilidad:[{
        tamano:{type:String, required:false},
        unidad_medida:{type:String, required:false},
        disponibilidad:{type:Number, required:false},
        precio:{type:Number, required:false},
    }],
    /*
    "tamano_disponibilidad": [
      {
        "tamano": "L",
        "unidad_medida": "talla",
        "disponibilidad": 17,
        "precio": 17500
      },
    ],
    "galeria": [
      {
        "imagen": "https://res.cloudinary.com/dcoq7odpu/image/upload/v1719258883/uvrthgvxgqezesg6gqsy.jpg",
        "_id": "d28ec66f-1b97-4731-8a05-621584d9e391"
      }, 
    ]
      */
});

var ProductoSchema=Schema({
    titulo:{type:String, required:true},
    slug:{type:String, required:true},
    galeria:[{type:Object,required:false}],
    portada:{type:String, required:true},
    precio:{type:Number, required:true},
    descripcion:{type:String, required:true},
    contenido:{type:String, required:true},
    stock:{type:Number, required:true},
    nventas:{type:Number, default:0, required:true},
    npuntos:{type:Number, default:0, required:true},
    //variedades:[{type:Object,require:false}],
    variedades:[variedadesSchema],
    //categoria:{type:String,required:true},
    categoria: {type: Schema.ObjectId, ref: 'categoria', required: true},
    titulo_variedad:{type:String,required:false},
    estado:{type:String, default:'Edicion', required:true},
    createdAt:{type:Date,default:Date.now,required:true}

})
module.exports =mongoose.model('producto',ProductoSchema)