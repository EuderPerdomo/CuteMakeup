'use-stric'
var express=require('express')
var auth=require('../middlewares/authenticate')
var multiparty=require('connect-multiparty')
var path =multiparty({uploadDir:'./uploads/productos'})

var adminController=require('../controllers/AdminController')
var api=express.Router()

//Login y Registro Admin
api.post('/login_admin',adminController.login_admin);
api.post('/registro_admin',adminController.registro_admin);
//TO DO , roles y asignacion de permisos

//Inician Rutas administración de clientes
api.get('/listar_clientes_admin',auth.auth,adminController.listar_clientes_admin)
api.delete('/eliminar_cliente_admin/:id',auth.auth,adminController.eliminar_cliente_admin);
api.post('/registro_cliente_admin',auth.auth,adminController.registro_cliente_admin)
api.get('/obtener_cliente_admin/:id',auth.auth,adminController.obtener_cliente_admin)
api.get('/obtener_cliente_admin/:id',auth.auth,adminController.obtener_cliente_admin)
api.put('/actualizar_cliente_admin/:id',auth.auth,adminController.actualizar_cliente_admin);
//Finalizan Rutas administración de Clientes

//Inician Rutas de administración de productos

//api.post('/registro_producto_admin',[auth.auth],adminController.registro_producto_admin);
api.post('/registro_producto_admin',[auth.auth,path],adminController.registro_producto_admin);
api.get('/listar_productos_admin',auth.auth,adminController.listar_productos_admin);
// api.get('/listar_variedades_productos_admin',auth.auth,AdminController.listar_variedades_productos_admin);

api.get('/obtener_producto_admin/:id',auth.auth,adminController.obtener_producto_admin);
api.get('/listar_etiquetas_producto_admin/:id',auth.auth,adminController.listar_etiquetas_producto_admin);

api.delete('/eliminar_etiqueta_producto_admin/:id',auth.auth,adminController.eliminar_etiqueta_producto_admin);
api.post('/agregar_etiqueta_producto_admin',auth.auth,adminController.agregar_etiqueta_producto_admin);
api.put('/actualizar_producto_admin/:id',[auth.auth,path],adminController.actualizar_producto_admin);
// api.get('/listar_variedades_admin/:id',auth.auth,AdminController.listar_variedades_admin);
// api.put('/actualizar_producto_variedades_admin/:id',auth.auth,AdminController.actualizar_producto_variedades_admin);
//api.delete('/eliminar_variedad_admin/:id',auth.auth,AdminController.eliminar_variedad_admin);
//api.post('/agregar_nueva_variedad_admin',auth.auth,AdminController.agregar_nueva_variedad_admin);

api.post('/agregar_variedad_producto_admin/:id',auth.auth,adminController.agregar_variedad_producto_admin);
api.put('/agregar_imagen_variedad_admin/:id',[auth.auth,path],adminController.agregar_imagen_variedad_admin);
api.delete('/eliminar_imagen_variedad_admin/:id_producto/:id_variedad/:id_imagen',auth.auth,adminController.eliminar_imagen_variedad_admin)
//Finalizan Rutas de administración de productos

//Inician rutas Administarcion de Categorias
api.get('/get_categorias',auth.auth,adminController.get_categorias_admin);
api.get('/listar_etiquetas_admin',auth.auth,adminController.listar_etiquetas_admin);
//Finalizan Rutas Administracion de Categorias

module.exports= api;