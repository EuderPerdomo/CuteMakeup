'use-stric'
var express=require('express')
var auth=require('../middlewares/authenticate')
var configController=require('../controllers/ConfigController')
var api=express.Router()


api.get('/get_categorias_publico',configController.get_categorias_publico)
module.exports= api;
