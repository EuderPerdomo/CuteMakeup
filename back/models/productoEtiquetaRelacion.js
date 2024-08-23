'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Producto_etiqueta_RelacionSchema = Schema({
    producto: {type: Schema.ObjectId, ref: 'producto', required: true},
    etiqueta: {type: Schema.ObjectId, ref: 'productoEtiqueta', required: true},
    createdAt: {type:Date, default: Date.now, require: true}
});

module.exports =  mongoose.model('producto_etiqueta_relacion',Producto_etiqueta_RelacionSchema);