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

//*************************************************/ Cliente Autenticado /************************************************* */
const agregar_carrito_cliente = async function (req, res) {

    if (req.user) {
        let data = req.body
        let carrito_cliente = await Carrito.find({ cliente: data.cliente, producto: data.producto, variedad: data.variedad, subvariedad: data.subvariedad })
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
    console.log('obtener carrito del clientedddddd', req.user)
    if (req.user) {
        let id = req.params['id']
        console.log('buscando carrito nuevamente autenticaado', id)
        let carrito_cliente = await Carrito.find({ cliente: id }).populate('producto')
        res.status(200).send({ data: carrito_cliente })

    } else {
        res.status(500).send({ message: 'Sin acceso' })
    }

}

const eliminar_carrito_cliente = async function (req, res) {
    if (req.user) {
        let id = req.params['id']
        let reg = await Carrito.findByIdAndDelete({ _id: id })
        res.status(200).send({ data: reg })
    } else {
        res.status(500).send({ message: 'Sin acceso' })
    }
}

//*************************************************/ Cliente  NOOO Autenticado /************************************************* */
const agregar_carrito_cliente_no_autenticado = async function (req, res) {
    let data = req.body
    let carrito_cliente = await Carrito.find({ cliente_no_autenticado: data.cliente_no_autenticado, producto: data.producto, variedad: data.variedad, subvariedad: data.subvariedad })
    if (carrito_cliente.length == 0) {
        let reg = await Carrito.create(data)
        res.status(200).send({ data: reg })
    } else if (carrito_cliente.length >= 1) {
        res.status(200).send({ data: undefined })
    }
}


const obtener_carrito_cliente_no_autenticado = async function (req, res) {

        let id = req.params['id']
        console.log('buscando carrito', id)
        let carrito_cliente = await Carrito.find({ cliente_no_autenticado: id }).populate('producto')
        res.status(200).send({ data: carrito_cliente })

}

const eliminar_carrito_cliente_no_autenticado = async function (req, res) {
        let id = req.params['id']
        let reg = await Carrito.findByIdAndDelete({ _id: id })
        res.status(200).send({ data: reg })

}

const fusionar_carrito_cliente = async function (req, res){
let id_temporal=req.params['id_temporal']
let id_cliente=req.params['id_cliente']


const carritoTemporal=await Carrito.find({cliente_no_autenticado:id_temporal})
const carritoCliente=await Carrito.find({cliente:id_cliente})


const productosCliente = carritoCliente.map(item => ({
    producto: item.producto.toString(),
    variedad: item.variedad.toString(),
    subvariedad: item.subvariedad.toString(),
    cantidad: item.cantidad,
    precio: item.precio
  }));


  const productosTemporales = carritoTemporal.map(item => ({
    producto: item.producto.toString(),
    variedad: item.variedad.toString(),
    subvariedad: item.subvariedad.toString(),
    cantidad: item.cantidad,
    precio: item.precio
  }));


  productosTemporales.forEach((productoTemp) => {
    const productoExistente = productosCliente.find((productoCliente) =>
      productoCliente.producto === productoTemp.producto &&
      productoCliente.variedad === productoTemp.variedad &&
      productoCliente.subvariedad === productoTemp.subvariedad
    );

    if (productoExistente) {
      // Sumar cantidades de productos repetidos
      productoExistente.cantidad += productoTemp.cantidad;
    } else {
      // Agregar el producto temporal al carrito del cliente
      productosCliente.push(productoTemp);
    }
  });

  await Carrito.deleteMany({ cliente: id_cliente });
  await Carrito.insertMany(productosCliente.map(producto => ({
    producto: producto.producto,
    cliente: id_cliente,
    variedad: producto.variedad,
    subvariedad: producto.subvariedad,
    cantidad: producto.cantidad,
    precio: producto.precio
  })));

  console.log('Temporal en cero ',carritoTemporal[0])
  await Carrito.deleteMany({ cliente_no_autenticado: id_temporal });

  const carritoClienteFinal=await Carrito.find({cliente:id_cliente})

//console.log('carro_cliente',carritoCliente, 'carro temporal', carritoTemporal)
res.status(200).send({data:carritoClienteFinal})
}

module.exports = {
    //Cliente Autenticado
    agregar_carrito_cliente,
    obtener_carrito_cliente,
    eliminar_carrito_cliente,

    //Cliente NOO Autenticado
    agregar_carrito_cliente_no_autenticado,
    obtener_carrito_cliente_no_autenticado,
    eliminar_carrito_cliente_no_autenticado,

    //Fusion

    fusionar_carrito_cliente,
}