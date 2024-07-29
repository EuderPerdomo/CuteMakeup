'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ClienteSchema = Schema({
    nombres: {type: String, required: true},
    apellidos: {type: String, required: true},
    pais: {type: String, required: false},
    email: {type: String, required: true},
    password: {type: String, required: true},
    telefono: {type: String, required: true},
    estado:{type:Boolean,default:true},   
    perfil:{type: String, default:'perfil.png', required: true},
    rol:{type: String, default:'cliente', required: true},
    dni: {type: String, required: false},
    genero:{type: String, required: false},
    fecha_nacimiento:{type: String, required: false},
    createdAt: {type:Date, default: Date.now, require: true},
});

module.exports =  mongoose.model('cliente',ClienteSchema);