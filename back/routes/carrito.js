'use-stric'
var express=require('express')
var auth=require('../middlewares/authenticate')
var carritoController=require('../controllers/CarritoController')
var api=express.Router()

//Cliente autenticado
api.post('/agregar_carrito_cliente',auth.auth,carritoController.agregar_carrito_cliente)
api.get('/obtener_carrito_cliente/:id',auth.auth,carritoController.obtener_carrito_cliente)
api.delete('/eliminar_carrito_cliente/:id',auth.auth,carritoController.eliminar_carrito_cliente)

// Cliente no autenticado
api.post('/agregar_carrito_cliente_no_autenticado',carritoController.agregar_carrito_cliente_no_autenticado)
api.get('/obtener_carrito_cliente_no_autenticado/:id',carritoController.obtener_carrito_cliente_no_autenticado)
api.delete('/eliminar_carrito_cliente_no_autenticado/:id',carritoController.eliminar_carrito_cliente_no_autenticado)

//Fusionar Carritos
api.put('/fusionar_carrito_cliente/:id_temporal/:id_cliente',carritoController.fusionar_carrito_cliente)
module.exports= api;