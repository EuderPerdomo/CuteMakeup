'use-stric'
var express=require('express')
var auth=require('../middlewares/authenticate')
var clienteController=require('../controllers/ClienteController')
var api=express.Router()

//Registro de Clientes Guest
api.post('/resgistro_cliente',clienteController.registro_cliente);
api.post('/login_cliente',clienteController.login_cliente);
//api.get('/obtener_cliente_guest/:id',clienteController.obtener_cliente_guest);
api.get('/obtener_cliente_guest/:id',auth.auth,clienteController.obtener_cliente_guest)
//api.post('/registro_instalador_guest',clienteController.registro_instalador_guest);
//api.post('/registro_cliente_empresa_guest',clienteController.registro_cliente_empresa_guest);

module.exports= api;