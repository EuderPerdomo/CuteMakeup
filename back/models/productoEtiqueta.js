'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductoEtiquetaSchema = Schema({
    titulo: {type: String, required: true},
    slug: {type: String, required: true},
    createdAt: {type:Date, default: Date.now, require: true}
});

module.exports =  mongoose.model('productoEtiqueta',ProductoEtiquetaSchema);