'use strict'

var mongoose=require('mongoose')
var Schema=mongoose.Schema

var DireccionSchema=Schema({
    cliente: {type: Schema.ObjectId, ref: 'cliente', required: true},
    destinatario:{type:String, required:true},
    dni:{type:String, required:true},
    direccion:{type:String, required:true},
    pais:{type:String, required:true},
    region:{type:String, required:true}, //Departamentos
    departamento:{type:String, required:false}, //Ciudades
    municipio:{type:String, required:false}, //Municipios
    telefono:{type:String, required:true},
    principal:{type:Boolean, required:true},
    status:{type:Boolean, default:true, required:true},
    createdAt:{type:Date,default:Date.now,required:true}

})
module.exports =mongoose.model('direccion',DireccionSchema)