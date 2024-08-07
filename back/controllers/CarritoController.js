'use-stric'
var Admin = require('../models/admin')
var bcrypt = require('bcrypt-nodejs')
var jwt = require('../helpers/jwt')
var Carrito = require('../models/carrito')

var path = require('path');
var fs = require('fs')
var mongoose = require('mongoose');

require('dotenv').config();// Para tarer rlas variables de entorno
const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL)


const agregar_carrito_cliente = async function (req, res) {

    if (req.user) {
        let data = req.body

        let carrito_cliente = await Carrito.find({ cliente: data.cliente, producto: data.producto })
        if (carrito_cliente.length == 0) {
            let reg = await Carrito.create(data)
            res.status(200).send({ data: reg })
        } else if (carrito_cliente.length >= 1) {
            res.status(200).send({ data: undefined })
        }


    } else {
        res.status(500).send({ message: 'Sin acceso' })
    }

}


const obtener_carrito_cliente = async function (req, res) {
    if (req.user) {
        let id = req.params['id']
        let carrito_cliente = await Carrito.find({ cliente: id }).populate('producto')
        res.status(200).send({ data: carrito_cliente })

    } else {
        res.status(500).send({ message: 'Sin acceso' })
    }

}

const eliminar_carrito_cliente = async function(req,res){
    if (req.user) {
        let id = req.params['id']
      let reg= await Carrito.findByIdAndDelete({_id:id})
      res.status(200).send({ data: reg })
    } else {
        res.status(500).send({ message: 'Sin acceso' })
    }
}


module.exports = {
    agregar_carrito_cliente,
    obtener_carrito_cliente,
    eliminar_carrito_cliente,
}