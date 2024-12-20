'use strict'

var mongoose=require('mongoose')
var Schema=mongoose.Schema

var CarritoSchema=Schema({
    producto: {type: Schema.ObjectId, ref: 'producto', required: true},
    cliente: {type: Schema.ObjectId, ref: 'cliente'},
    cliente_no_autenticado: { type: String },
    precio:{type:Number, required:true},
    cantidad:{type:Number, required:true},
    variedad:{type:String, required:true},
    subvariedad:{type:String, required:true},
    createdAt:{type:Date,default:Date.now,required:true}

})
module.exports =mongoose.model('carrito',CarritoSchema)