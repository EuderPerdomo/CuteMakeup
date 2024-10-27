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


const registro_categoria_admin = async function (req, res) {

  if (req.user) {

    try {
      let data = req.body;
      let categorias = await Categoria.find({ titulo: data.titulo });

      if (categorias.length == 0) {

        var img_path = req.files.portada.path;

        data.slug = data.titulo.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        console.log('voy a ir a cloudinary', img_path)

        const { secure_url } = await cloudinary.uploader.upload(img_path, {
          folder: 'CuteMakeup'
        })

        data.portada = secure_url;
        let reg = await Categoria.create(data);
        console.log('crear datos', data)
        res.status(201).send({
          message: 'Categoria Registrada correctamente',
          data: reg,
          timestamp: new Date().toISOString(),
          path: req.originalUrl,
          status: 201
        });
      } else {
        res.status(409).send({
          message: 'El Titulo de Categoria ya existe',
          error: 'categoria Duplicada',
          timestamp: new Date().toISOString(),
          path: req.originalUrl,
          status: 409
        });
      }

    } catch (error) {
      res.status(500).send({
        message: 'Server Error',
        error: error.message,
        timestamp: new Date().toISOString(),
        path: req.originalUrl,
        status: 500
      });
    }

  } else {
    res.status(401).send({
      message: 'Not Authorized',
      error: error.message,
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
      status: 401
    });
  }
}


const get_categorias_publico = async function (req, res) {
  var reg = await Categoria.find();
  res.status(200).send({ data: reg });
}

module.exports = {
  get_categorias_publico,
  registro_categoria_admin,
}