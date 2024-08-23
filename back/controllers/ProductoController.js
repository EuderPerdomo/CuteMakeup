'use-stric'
var Producto = require('../models/producto')
var ProductoEtiqueta=require('../models/productoEtiqueta')
var ProductoEtiquetaRelacion=require('../models/productoEtiquetaRelacion')
var fs = require('fs')
var mongoose = require('mongoose');

require('dotenv').config();// Para tarer rlas variables de entorno
const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL)

//************************************************** Metodos privados ****************************************
const crear_etiqueta_producto_global_admin = async function(req,res){
    if(req.user){
        let data = req.body;
        data.slug = data.titulo.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        var reg = await ProductoEtiqueta.create(data);
        res.status(200).send({data:reg});
    }else{
        res.status(500).send({message: 'NoAccess'});
    }
}

const listar_etiquetas_producto_global_admin = async function (req, res) {
    if (req.user) {
        var reg = await ProductoEtiqueta.find();
        res.status(200).send({ data: reg });
    } else {
        res.status(500).send({ message: 'NoAccess' });
    }
}

const eliminar_etiqueta_producto_global_admin = async function (req, res) {
    if (req.user) {
         var id = req.params['id'];//Id de la etiqueta a eliminar
        let deletiqueta = await ProductoEtiqueta.findByIdAndDelete(({ _id: id }));
        let relaciones = await ProductoEtiquetaRelacion.deleteMany(({ etiqueta: id }));
         res.status(200).send({ data: deletiqueta });

    } else {
        res.status(500).send({ message: 'NoAccess' });
    }
}

const listar_etiquetas_producto_admin = async function (req, res) {
    if (req.user) {
        var id = req.params['id'];
        var etiquetas = await ProductoEtiquetaRelacion.find({ producto: id }).populate('etiqueta');
        
        res.status(200).send({ data: etiquetas });
    } else {
        res.status(500).send({ message: 'NoAccess' });
    }
}

const agregar_etiqueta_producto_admin = async function (req, res) {
    if (req.user) {
        let data = req.body;
        try {
            // Verifica si la etiqueta ya está asociada con el producto
            let etiquetaExistente = await ProductoEtiquetaRelacion.findOne({
                producto: data.producto,
                etiqueta: data.etiqueta
            });

            if (etiquetaExistente) {
                // Si ya existe, envía un mensaje indicando que la etiqueta ya está agregada
                res.status(200).send({ message: 'La etiqueta ya está agregada a este producto.' });
            } else {
                // Si no existe, crea una nueva asociación
                var reg = await ProductoEtiquetaRelacion.create(data);
                res.status(201).send({ data: reg });
            }
        } catch (error) {
        
            res.status(500).send({ message: 'Error en el servidor', error });
        }
    } else {
        res.status(401).send({ message: 'Sin acceso' });
    }
};

const eliminar_etiqueta_producto_admin = async function (req, res) {
    if (req.user) {
        var id = req.params['id'];
   
        let reg = await ProductoEtiquetaRelacion.findByIdAndDelete(({ _id: id }));
        res.status(200).send({ data: reg });

    } else {
        res.status(500).send({ message: 'NoAccess' });
    }
}

//************************************************** Metodos Publicos ****************************************
listar_productos_public = async function (req, res) {
    var filtro=req.params['filtro']
        var productos = await Producto.find({titulo:new RegExp(filtro, 'i')}).populate('categoria');
        res.status(200).send({ data: productos });
}


const obtener_producto_public = async function (req, res) {
        var slug = req.params['slug'];
        try {
            var reg = await Producto.findOne({ slug: slug }).populate('categoria');
            res.status(200).send({ data: reg });
        } catch (error) {
            res.status(200).send({ data: undefined });
        }
}


const listar_productos_recomendado_public = async function (req, res) {
    var filtro=req.params['categoria']
        var productos = await Producto.find({categoria:filtro}).sort({createdAt:-1}).limit(8).populate('categoria');
        res.status(200).send({ data: productos });
}

module.exports={    
    listar_productos_public,
    obtener_producto_public,
    listar_productos_recomendado_public,

    //Etiquetas de los productos
        //Globales
    crear_etiqueta_producto_global_admin,
    listar_etiquetas_producto_global_admin,
    eliminar_etiqueta_producto_global_admin,
        //Locales a acada producto
    eliminar_etiqueta_producto_admin,
    agregar_etiqueta_producto_admin,
    listar_etiquetas_producto_admin,

}