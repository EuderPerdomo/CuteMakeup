'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var imagenSchema = new mongoose.Schema({
    titulo: {type: String, required: true},
    subtitulo: {type: String, required: true},
    tituloBoton: {type: String, required: true},
    enlace: {type: String, required: true},
    imagen: {type: String, required: true},
});

var BannerSchema = Schema({
    titulo: {type: String, required: true},
    createdAt: {type:Date, default: Date.now, require: true},
    galeria:[imagenSchema],
});

module.exports =  mongoose.model('banner',BannerSchema);