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

listar_productos_public = async function (req, res) {
        var productos = await Producto.find();
        res.status(200).send({ data: productos });
}


module.exports={    
    listar_productos_public,

}