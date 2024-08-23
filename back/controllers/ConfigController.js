'use-stric'
var Admin = require('../models/admin')
var bcrypt = require('bcrypt-nodejs')
var jwt = require('../helpers/jwt')
var Cliente = require('../models/cliente')
var Producto = require('../models/producto')
var Categoria = require('../models/categoria')
var Etiqueta = require('../models/productoEtiqueta')
var ProductoEtiqueta = require('../models/productoEtiquetaRelacion')
var path = require('path');
var fs = require('fs')
var mongoose = require('mongoose');

require('dotenv').config();// Para tarer rlas variables de entorno
const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL)

const get_categorias_publico = async function (req, res) {
    var reg = await Categoria.find();
    res.status(200).send({ data: reg });
}

module.exports = {
  get_categorias_publico
}