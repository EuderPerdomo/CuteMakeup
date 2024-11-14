'use-stric'
var express=require('express')
var auth=require('../middlewares/authenticate')
var configController=require('../controllers/ConfigController')
var productoController=require('../controllers/ProductoController')
var api=express.Router()

//Mtodos Privados

api.post('/crear_etiqueta_producto_global_admin',auth.auth,productoController.crear_etiqueta_producto_global_admin);
api.delete('/eliminar_etiqueta_producto_global_admin/:id',auth.auth,productoController.eliminar_etiqueta_producto_global_admin);
api.get('/listar_etiquetas_producto_global_admin',auth.auth,productoController.listar_etiquetas_producto_global_admin);

api.get('/listar_etiquetas_producto_admin/:id',auth.auth,productoController.listar_etiquetas_producto_admin);
api.delete('/eliminar_etiqueta_producto_admin/:id',auth.auth,productoController.eliminar_etiqueta_producto_admin);
api.post('/agregar_etiqueta_producto_admin',auth.auth,productoController.agregar_etiqueta_producto_admin);
        //Locales a acada producto


//Rutas Inventario de Productos
api.get('/inventario_productos_admin',auth.auth,productoController.inventario_productos_admin)

//Metodos Publicos
api.get('/listar_productos_public/:filtro?',productoController.listar_productos_public)
api.get('/obtener_producto_public/:slug',productoController.obtener_producto_public)
api.get('/listar_productos_recomendado_public/:categoria',productoController.listar_productos_recomendado_public)
api.get('/listar_productos_nuevos_publico',productoController.listar_productos_nuevos_public);



module.exports= api;
