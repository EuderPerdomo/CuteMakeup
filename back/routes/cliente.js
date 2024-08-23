'use-stric'
var express=require('express')
var auth=require('../middlewares/authenticate')
var clienteController=require('../controllers/ClienteController')
var api=express.Router()

//Registro de Clientes Guest
api.post('/resgistro_cliente',clienteController.registro_cliente);
api.post('/login_cliente',clienteController.login_cliente);
api.get('/obtener_cliente_guest/:id',auth.auth,clienteController.obtener_cliente_guest)



//Direcciones
api.post('/registro_direccion_cliente',auth.auth,clienteController.registro_direccion_cliente);
api.get('/obtener_direccion_todos_cliente/:id',auth.auth,clienteController.obtener_direccion_todos_cliente)
api.put('/cambiar_direccion_principal_cliente/:id/:cliente',auth.auth,clienteController.cambiar_direccion_principal_cliente);
api.get('/eliminar_direccion_cliente/:id',auth.auth,clienteController.eliminar_direccion_cliente);

//Contacto
api.post('/enviar_mensaje_contacto',clienteController.enviar_mensaje_contacto);

module.exports= api;