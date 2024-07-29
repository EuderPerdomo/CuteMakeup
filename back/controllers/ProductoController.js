'use-stric'
var Admin = require('../models/admin')
var bcrypt = require('bcrypt-nodejs')
var jwt = require('../helpers/jwt')
var Cliente = require('../models/cliente')
var Producto = require('../models/producto')
var Categoria = require('../models/categoria')
var Etiqueta = require('../models/etiqueta')
var ProductoEtiqueta = require('../models/producto_etiqueta')
var path = require('path');
var fs = require('fs')
var mongoose = require('mongoose');

require('dotenv').config();// Para tarer rlas variables de entorno
const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL)

//Metodos Publicos
listar_productos_public = async function (req, res) {
    var filtro=req.params['filtro']
        var productos = await Producto.find({titulo:new RegExp(filtro, 'i')}).populate('categoria');
        res.status(200).send({ data: productos });
}


const obtener_producto_public = async function (req, res) {
        var slug = req.params['slug'];
        try {
            var reg = await Producto.findOne({ slug: slug }).populate('categoria');
            res.status(200).send({ data: reg });
        } catch (error) {
            res.status(200).send({ data: undefined });
        }
}


const listar_productos_recomendado_public = async function (req, res) {
    var filtro=req.params['categoria']
        var productos = await Producto.find({categoria:filtro}).sort({createdAt:-1}).limit(8).populate('categoria');
        res.status(200).send({ data: productos });
}

module.exports={    
    listar_productos_public,
    obtener_producto_public,
    listar_productos_recomendado_public,
}