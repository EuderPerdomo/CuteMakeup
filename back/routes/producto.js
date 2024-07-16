'use-stric'
var express=require('express')
var auth=require('../middlewares/authenticate')
var configController=require('../controllers/ConfigController')
var productoController=require('../controllers/ProductoController')
var api=express.Router()

//Metodos Publicos
api.get('/listar_productos_public/:filtro?',productoController.listar_productos_public)
module.exports= api;
