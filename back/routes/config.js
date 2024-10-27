'use-stric'
var express=require('express')
var auth=require('../middlewares/authenticate')
var configController=require('../controllers/ConfigController')
var multiparty=require('connect-multiparty')
var path =multiparty({uploadDir:'./uploads/productos'})


var api=express.Router()


api.get('/get_categorias_publico',configController.get_categorias_publico)
api.post('/registro_categoria_admin',[auth.auth,path],configController.registro_categoria_admin);
module.exports= api;
