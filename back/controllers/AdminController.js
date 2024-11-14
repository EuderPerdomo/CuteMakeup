'use-stric'
var Admin = require('../models/admin')
var bcrypt = require('bcrypt-nodejs')
var jwt = require('../helpers/jwt')
var Cliente = require('../models/cliente')
var Producto = require('../models/producto')
var Categoria = require('../models/categoria')
var ProductoEtiqueta = require('../models/productoEtiqueta')
var ProductoEtiquetaRelacion = require('../models/productoEtiquetaRelacion')
var Contacto =require('../models/contacto')

var path = require('path');
var fs = require('fs')
var mongoose = require('mongoose');

require('dotenv').config();// Para tarer rlas variables de entorno
const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL)

//Registro y logIn Admin
const registro_admin = async function (req, res) {
    var data = req.body;
    var admin_arr = [];

    admin_arr = await Admin.find({ email: data.email });
    if (admin_arr.length == 0) {
        if (data.password) {
            bcrypt.hash(data.password, null, null, async function (err, hash) {
                if (hash) {
                    data.password = hash;
                    try {
                        var reg = await Admin.create(data);
                        res.status(200).send({ data: reg });
                    } catch (error) {
                        res.status(200).send({ message: error.message });
                    }

                } else {
                    res.status(200).send({ message: 'ErrorServer', data: undefined });
                }
            })
        } else {
            res.status(200).send({ message: 'No hay una contraseña', data: undefined });
        }
    } else {
        res.status(200).send({ message: 'El correo ya existe en la base de datos', data: undefined });
    }
}

const login_admin = async function (req, res) {
    var data = req.body;
    var admin_arr = [];

    admin_arr = await Admin.find({ email: data.email });
    if (admin_arr.length == 0) {
        res.status(200).send({ message: 'Usuario No registrado', data: undefined });
    } else {
        //LOGIN
        let user = admin_arr[0];
        bcrypt.compare(data.password, user.password, async function (error, check) {
            if (check) {
                res.status(200).send({
                    data: user,
                    token: jwt.createToken(user)
                });
            } else {
                res.status(200).send({ message: 'Las credenciales no coinciden', data: undefined });
            }
        });

    }
}


//Inician Rutas Administración de clientes ############################################################################
registro_cliente_admin = async function (req, res) {
    let data = req.body;
    var clientes_arr = [];

    clientes_arr = await Cliente.find({ email: data.email });
    if (clientes_arr.length == 0) {
        if (data.password) {
            bcrypt.hash(data.password, null, null, async function (err, hash) {
                if (hash) {
                    data.password = hash;

                    try {
                        var reg = await Cliente.create(data);
                        //res.status(201).send({ data: reg });

                        res.status(201).send({
                            message: 'Cliente registrado correctamente',
                            data: reg,
                            timestamp: new Date().toISOString(),
                            path: req.originalUrl,
                            status: 201
                        });


                    } catch (error) {
                        //res.status(400).send({ message: 'Bad Request', data: undefined });
                        res.status(400).send({
                            message: 'Bad Request',
                            error: error.message,
                            timestamp: new Date().toISOString(),
                            path: req.originalUrl,
                            status: 400
                        });
                    }
                } else {
                    //res.status(500).send({ message: 'ErrorServer', data: undefined });
                    res.status(500).send({
                        message: 'Internal Server Error',
                        error: error.message,
                        timestamp: new Date().toISOString(),
                        path: req.originalUrl,
                        status: 500
                    });
                }
            })
        } else {
            //res.status(200).send({ message: 'No hay una contraseña', data: undefined });
            res.status(500).send({
                message: 'Error Password',
                error: error.message,
                timestamp: new Date().toISOString(),
                path: req.originalUrl,
                status: 500
            });
        }

    } else {
        //res.status(409).send({ message: 'El correo ya existe, intente con otro.', data: undefined });
        res.status(409).send({
            message: 'El correo ya existe',
            error: 'Email Dupicado',
            timestamp: new Date().toISOString(),
            path: req.originalUrl,
            status: 409
        });
    }
}

listar_clientes_admin = async function (req, res) {
    if (req.user) {
        let query = { estado: true }
        var clientes = await Cliente.find(query);
        res.status(200).send({ data: clientes });
    } else {
        //res.status(500).send({ message: 'NoAccess' });
        res.status(401).send({
            message: 'Not Authorized',
            error: error.message,
            timestamp: new Date().toISOString(),
            path: req.originalUrl,
            status: 401
        });
    }
}

const obtener_cliente_admin = async function (req, res) {
    if (req.user) {
        var id = req.params['id'];

        try {
            var reg = await Cliente.findById({ _id: id });
            res.status(200).send({ data: reg });
        } catch (error) {
            res.status(200).send({ data: undefined });
        }
    } else {
        //res.status(500).send({ message: 'NoAccess' });
        res.status(401).send({
            message: 'Not Authorized',
            error: error.message,
            timestamp: new Date().toISOString(),
            path: req.originalUrl,
            status: 401
        });
    }
}

const actualizar_cliente_admin = async function (req, res) {
    if (req.user) {
        var id = req.params['id'];
        var data = req.body;

        if (data.password) {
            console.log('Con contraseña');
            bcrypt.hash(data.password, null, null, async function (err, hash) {
                console.log(hash);
                var reg = await Cliente.findByIdAndUpdate({ _id: id }, {
                    nombres: data.nombres,
                    apellidos: data.apellidos,
                    telefono: data.telefono,
                    fecha_nacimiento: data.f_nacimiento,
                    dni: data.dni,
                    email: data.email,
                    genero: data.genero,
                    password: hash,
                });
                res.status(200).send({ data: reg });
            });

        } else {



            console.log('Sin contraseña');
            var reg = await Cliente.findByIdAndUpdate({ _id: id }, {
                nombres: data.nombres,
                apellidos: data.apellidos,
                telefono: data.telefono,
                fecha_nacimiento: data.f_nacimiento,
                dni: data.dni,
                email: data.email,
                genero: data.genero
            });
            res.status(200).send({ data: reg });
        }

    } else {
        //res.status(500).send({message: 'NoAccess'});
        res.status(401).send({
            message: 'Not Authorized',
            error: error.message,
            timestamp: new Date().toISOString(),
            path: req.originalUrl,
            status: 401
        });
    }
}

const eliminar_cliente_admin = async function (req, res) {
    if (req.user) {

        try {
            var id = req.params['id'];
            let reg = await Cliente.findByIdAndUpdate(id, { estado: false }, { new: true });
            // res.status(200).send({ data: reg });

            if (!reg) {
                return res.status(404).json({ message: 'Cliente no encontrado' });
            }

            res.status(204).send({
                message: 'Cliente Eliminado Correctamente',
                data: reg,
                timestamp: new Date().toISOString(),
                path: req.originalUrl,
                status: 204
            });
        } catch (error) {
            res.status(500).send({
                message: 'Error En el servidor',
                error: err.message,
                timestamp: new Date().toISOString(),
                path: req.originalUrl,
                status: 500
            });
        }


    } else {
        //res.status(500).send({ message: 'NoAccess' });
        res.status(401).send({
            message: 'Not Authorized',
            error: error.message,
            timestamp: new Date().toISOString(),
            path: req.originalUrl,
            status: 401
        });
    }
}

//Finalizan Rutas Administración de clientes ############################################################################

//Inician Rutas Administración de Productos ############################################################################

const registro_producto_admin = async function (req, res) {
    console.log('Cuerpo', req.body)
    if (req.user) {

        try {
            let data = req.body;
            console.log('Ingreso', data)
            let productos = await Producto.find({ titulo: data.titulo });
            let arr_etiquetas = JSON.parse(data.etiquetas);

            if (productos.length == 0) {

                var img_path = req.files.portada.path;
                //var name = img_path.split('\\');
                //var portada_name = name[2];

                data.slug = data.titulo.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
                console.log('voy a ir a cloudinary', img_path)
                //const {secure_url}= await cloudinary.uploader.upload(img_path) //Opcional: .then(result=>console.log(result));

                const { secure_url } = await cloudinary.uploader.upload(img_path, {
                    folder: 'CuteMakeup'
                })

                data.portada = secure_url;
                let reg = await Producto.create(data);
                if (arr_etiquetas.length >= 1) {
                    for (var item of arr_etiquetas) {
                        await ProductoEtiqueta.create({
                            etiqueta: item.etiqueta,
                            producto: reg._id,
                        });
                    }
                }
                res.status(201).send({
                    message: 'Producto registrado correctamente',
                    data: reg,
                    timestamp: new Date().toISOString(),
                    path: req.originalUrl,
                    status: 201
                });
            } else {
                res.status(409).send({
                    message: 'El Titulo de Producto ya existe',
                    error: 'Email Dupicado',
                    timestamp: new Date().toISOString(),
                    path: req.originalUrl,
                    status: 409
                });
            }

        } catch (error) {
            res.status(500).send({
                message: 'Server Error',
                error: error.message,
                timestamp: new Date().toISOString(),
                path: req.originalUrl,
                status: 500
            });
        }

    } else {
        res.status(401).send({
            message: 'Not Authorized',
            error: error.message,
            timestamp: new Date().toISOString(),
            path: req.originalUrl,
            status: 401
        });
    }
}

listar_productos_admin = async function (req, res) {
    if (req.user) {
        var productos = await Producto.find();
        res.status(200).send({ data: productos });
    } else {
        res.status(500).send({ message: 'NoAccess' });
    }
}


const obtener_producto_admin = async function (req, res) {
    if (req.user) {
        var id = req.params['id'];

        try {
            var reg = await Producto.findById({ _id: id });
            res.status(200).send({ data: reg });
        } catch (error) {
            res.status(200).send({ data: undefined });
        }
    } else {
        res.status(500).send({ message: 'NoAccess' });
    }
}

const actualizar_producto_admin = async function (req, res) {
    if (req.user) {
        let id = req.params['id'];
        let data = req.body;
        if (req.files) {
            //SI HAY IMAGEN
            var img_path = req.files.portada.path;
            var name = img_path.split('\\');
            var portada_name = name[2];

            //Buscar la Imagen anterior 
            modelo = await Producto.findById(id)//Traigo el modelo actual 
            const nombreArr = modelo.portada.split('/')
            const nombre = nombreArr[nombreArr.length - 1]
            const [public_id] = nombre.split('.')
            cloudinary.uploader.destroy(public_id) //Elimina la anterior
            //Fin buscar imagen anterior

            const { secure_url } = await cloudinary.uploader.upload(img_path)//Cargo nueva imagen

            let reg = await Producto.findByIdAndUpdate({ _id: id }, {
                titulo: data.titulo,
                stock: data.stock,
                precio: data.precio,
                peso: data.peso,
                sku: data.sku,
                categoria: data.categoria,
                visibilidad: data.visibilidad,
                descripcion: data.descripcion,
                contenido: data.contenido,
                portada: secure_url,
                tipo: data.tipo,

            });

            fs.stat('./uploads/productos/' + reg.portada, function (err) {
                if (!err) {
                    fs.unlink('./uploads/productos/' + reg.portada, (err) => {
                        if (err) throw err;
                    });
                }
            })

            res.status(200).send({ data: reg });
        } else {
            //NO HAY IMAGEN
            let reg = await Producto.findByIdAndUpdate({ _id: id }, {
                titulo: data.titulo,
                stock: data.stock,
                precio: data.precio,
                peso: data.peso,
                sku: data.sku,
                categoria: data.categoria,
                visibilidad: data.visibilidad,
                descripcion: data.descripcion,
                contenido: data.contenido,
                tipo: data.tipo,


            });
            res.status(200).send({ data: reg });
        }
    } else {
        res.status(500).send({ message: 'NoAccess' });
    }
}

//Finalizan Rutas Administración de Productos ##########################################################################

//Inician rutas de Categorias
const get_categorias_admin = async function (req, res) {
    if (req.user) {
        var reg = await Categoria.find();
        res.status(200).send({ data: reg });
    } else {
        res.status(500).send({ message: 'NoAccess' });
    }
}


//Finalizan Rutas de categorias

//Inician rutas variedad
const agregar_variedad_producto_admin = async function (req, res) {
    if (req.user) {
        let data = req.body;
        let id_producto = req.params['id'];
        try {

            //1 Busco Producto
            let producto = await Producto.findOne({
                _id: id_producto,
            });
           

            //2 Busco si tienen Variedades

            if (!producto.variedades || producto.variedades.length === 0) {//Si no tiene ninguna Agrego data de la variedad
                console.log('No tiene variedades',data)
                let reg = await Producto.findByIdAndUpdate({ _id: id_producto }, {
                    $push: {
                        variedades: data
                    }
                }, { useFindAndModify: false });

                console.log('No tiene variedades',reg)

                res.status(200).send({ data: reg });

            } else {// Si tiene Variedades
                //Verificar que la variedad que esta agregando no exista
                let variedad = producto.variedades.id(data._id);
                // Añadir la nueva variedad a la lista existente

                if (variedad) {
                    //si ya existe la actualizo
                    const query = { _id: id_producto };
                    const updateDocument = {
                        $set: { "variedades.$[v]": data }
                    };
                    const options = {
                        arrayFilters: [
                            { "v._id": new mongoose.Types.ObjectId(data._id) }
                        ]
                    };
                    let reg = await Producto.updateOne(query, updateDocument, options);
                    res.status(200).send({ data: reg });

                } else {

                    let reg = await Producto.findByIdAndUpdate({ _id: id_producto }, {
                        $push: {
                            variedades: data
                        }
                    }, { useFindAndModify: false });
                    res.status(200).send({ data: reg });

                }
            }

        } catch (error) {
            console.log(error)
            res.status(500).send({
                message: 'Server Error',
                error: error.message,
                timestamp: new Date().toISOString(),
                path: req.originalUrl,
                status: 500
            });
        }
    } else {
        res.status(401).send({ message: 'Sin acceso' });
    }
    //res.status(200).send({message:"Ingreso"});
}

const agregar_nueva_variedad_producto_admin = async function(req,res){

    if (req.user) {
        let data = req.body;
        let id_producto = req.params['id'];
        try {

            //1 Busco Producto
            let producto = await Producto.findOne({
                _id: id_producto,
            });
           

            let reg = await Producto.findByIdAndUpdate({ _id: id_producto }, {
                $push: {
                    variedades: data
                }
            }, { useFindAndModify: false });

            res.status(200).send({ data: reg });
            

            //2 Busco si tienen Variedades
/*
            if (!producto.variedades || producto.variedades.length === 0) {//Si no tiene ninguna Agrego data de la variedad
                console.log('No tiene variedades',data)
                let reg = await Producto.findByIdAndUpdate({ _id: id_producto }, {
                    $push: {
                        variedades: data
                    }
                }, { useFindAndModify: false });

                console.log('No tiene variedades',reg)

                res.status(200).send({ data: reg });

            } else {// Si tiene Variedades
                //Verificar que la variedad que esta agregando no exista
                let variedad = producto.variedades.id(data._id);
                // Añadir la nueva variedad a la lista existente

                if (variedad) {
                    //si ya existe la actualizo
                    const query = { _id: id_producto };
                    const updateDocument = {
                        $set: { "variedades.$[v]": data }
                    };
                    const options = {
                        arrayFilters: [
                            { "v._id": new mongoose.Types.ObjectId(data._id) }
                        ]
                    };
                    let reg = await Producto.updateOne(query, updateDocument, options);
                    res.status(200).send({ data: reg });

                } else {

                    let reg = await Producto.findByIdAndUpdate({ _id: id_producto }, {
                        $push: {
                            variedades: data
                        }
                    }, { useFindAndModify: false });
                    res.status(200).send({ data: reg });

                }
            }
*/
        } catch (error) {
            console.log(error)
            res.status(500).send({
                message: 'Server Error',
                error: error.message,
                timestamp: new Date().toISOString(),
                path: req.originalUrl,
                status: 500
            });
        }
    } else {
        res.status(401).send({ message: 'Sin acceso' });
    }

}


//Agregar caracteristica de variedad

const agregar_nueva_caracteristica_variedad_admin = async function(req,res){
    if (req.user) {
        let data = req.body;
        let id_producto = req.params['id_producto'];
        let id_variedad = req.params['id_variedad'];
       try {

        const registro = await Producto.findOneAndUpdate(
            { _id: id_producto, 'variedades._id': id_variedad },
            { $push: { 'variedades.$.tamano_disponibilidad': data } },
           // { new: true }  // Para devolver el documento actualizado
          )

            //console.log('Producto actualizado:', updatedProduct);
            res.status(200).send({ data: registro });

        } catch (error) {
            console.log(error)
            res.status(500).send({
                message: 'Server Error',
                error: error.message,
                timestamp: new Date().toISOString(),
                path: req.originalUrl,
                status: 500
            });
        }
        


    } else {
        res.status(401).send({ message: 'Sin Acceso' });
    }

}

const editar_caracteristica_variedad_admin = async function(req,res){
    if (req.user) {
        let data = req.body;
        let id_producto = req.params['id_producto'];
        let id_variedad = req.params['id_variedad'];
        let id_caracteristica = req.params['id_caracteristica'];
       try {

        const registro = await Producto.findOneAndUpdate(
            {
                _id: id_producto,
                'variedades._id': id_variedad,
                'variedades.tamano_disponibilidad._id': id_caracteristica // Asegurarte de buscar la característica específica
            },
            {
                $set: { 
                    'variedades.$.tamano_disponibilidad.$[elem]': data // Actualizar los datos de la característica específica
                }
            },
            {
                arrayFilters: [{ 'elem._id': id_caracteristica }], // Filtrar para actualizar solo la característica correcta
               // new: true // Para devolver el documento actualizado
            }
        );

/*
        const registro = await Producto.findOneAndUpdate(
            { _id: id_producto, 'variedades._id': id_variedad },
            { $push: { 'variedades.$.tamano_disponibilidad': data } },
           // { new: true }  // Para devolver el documento actualizado
          )
*/
            //console.log('Producto actualizado:', updatedProduct);
            res.status(200).send({ data: registro });

        } catch (error) {
            console.log(error)
            res.status(500).send({
                message: 'Server Error',
                error: error.message,
                timestamp: new Date().toISOString(),
                path: req.originalUrl,
                status: 500
            });
        }
        


    } else {
        res.status(401).send({ message: 'Sin Acceso' });
    }

}


const agregar_imagen_variedad_admin = async function (req, res) {
    console.log('##############################################################ingresa aqui')
    if (req.user) {
        let id = req.params['id'];
        let data = req.body;

        console.log('data recibida', data)

        var img_path = req.files.imagen.path;
        var name = img_path.split('\\');
        var imagen_name = name[2];

        const { secure_url } = await cloudinary.uploader.upload(img_path)


        //Buscar si tiene imagenes

        let producto = await Producto.findOne({
            _id: id,
        });

        console.log('Producto', producto)
        //Busca la variedad
        let variedad = producto.variedades.id(data.id_variedad);
        console.log('Galeria de esta variedad *******************************************', variedad)
        //Reemplazar o agregar una nueva
        // buscar imagen existente y reemplazar
        //
        const query = { _id: id };
        const newImageId = new mongoose.Types.ObjectId();

        const updateDocument = {
            $push: { "variedades.$[v].galeria": { imagen: secure_url, _id: newImageId } }
        };
        const options = {
            arrayFilters: [
                { "v._id": new mongoose.Types.ObjectId(data.id_variedad) }
            ]
        };
        let reg = await Producto.updateOne(query, updateDocument, options);

        if (reg.nModified === 0) {
            return res.status(404).send({ message: 'Variedad no encontrada o datos sin cambios' });
        }
        console.log('retornar datos de la nueva imagen', reg)
        //res.status(200).send({ data: reg });

        // Devuelve la nueva imagen añadid

        res.status(200).send({
            message: 'Imagen añadida a la galería correctamente',
            data: { imagen: { imagen: secure_url, _id: newImageId } }
        });

        //




        /*
        let reg = await Producto.findByIdAndUpdate({ _id: id }, {
            $push: {
                galeria: {
                    //imagen: imagen_name,
                    imagen: secure_url,
                    _id: data._id
                }
            }
        }, { useFindAndModify: false });


        */
        //res.status(200).send({ data: reg });
    } else {
        res.status(500).send({ message: 'NoAccess' });
    }
}

const eliminar_imagen_variedad_admin = async function (req, res) {

    if (req.user) {
        try {
            var id_producto = req.params['id_producto']
            var id_variedad = req.params['id_variedad']
            var id_imagen = req.params['id_imagen']


            const productoActualizado = await Producto.findByIdAndUpdate(
                id_producto,
                {
                    $pull: {
                        "variedades.$[v].galeria": { _id: id_imagen }
                    }
                },
                {
                    new: true, // Devuelve el documento actualizado
                    arrayFilters: [{ "v._id": id_variedad }],
                    useFindAndModify: false // Para evitar el uso de métodos obsoletos
                }
            );
            console.log(productoActualizado)
            if (!productoActualizado) {
                return res.status(404).send({ message: 'Producto no encontrado' });
            }

            res.status(200).send({
                message: 'Imagen eliminada correctamente',
                data: productoActualizado
            });


        } catch (error) {
            console.log('errror al eliminar')
            res.status(500).send({ message: 'Error al eliminar la imagen', error });
        }



    } else {
        res.status(500).send({ message: 'Usuario No Autorizado' });
    }
}

//Finalizan rutas galerias



/* Inician Mensajes*/


const obtener_mensajes_admin = async function (req, res) {
    if (req.user) {
        let data = req.body
        let reg = await Contacto.find().sort({ createdAt: -1 })
        res.status(200).send({ data: reg })
    } else {
        res.status(500).send({ message: 'No Acces' })
    }
}

const cerrar_mensaje_admin = async function (req, res) {
    if (req.user) {
        let data = req.body
            let id = req.params['id']
            let reg = await Contacto.findByIdAndUpdate({ _id: id }, { estado: 'Cerrado' })
            res.status(200).send({ data: reg })
    } else {
        res.status(500).send({ message: 'No Acces' })
    }
}


/*Finaliza mensajes */

/*Inican rutas eliminacion caracteristicas y variedades de productos */
const eliminar_variedad_producto_admin = async function (req, res) {

    if (req.user) {
        try {

            console.log('Eliminar', req.params)
            var id_producto = req.params['id_producto']
            var id_variedad = req.params['id_variedad']
            const productoActualizado = await Producto.findByIdAndUpdate(
                { _id: id_producto },
                { $pull: { variedades: { _id: id_variedad } } },
                { new: true } // Esta opción devuelve el documento actualizado
            );
            console.log(productoActualizado)
            if (!productoActualizado) {
                return res.status(404).send({ message: 'Producto no encontrado' });
            }

            res.status(200).send({
                message: 'Variedad eliminada correctamente',
                data: productoActualizado
            });


        } catch (error) {
            console.log('errror al eliminar',error)
            res.status(500).send({ message: 'Error al eliminar la variedad', error });
        }



    } else {
        res.status(500).send({ message: 'Usuario No Autorizado' });
    }
}


const eliminar_carcateristica_variedad_producto_admin = async function (req, res) {

    if (req.user) {
        try {

            var id_caracteristica= req.params['id_carcateristica']
            var id_producto = req.params['id_producto']
            var id_variedad = req.params['id_variedad']

            const productoActualizado = await Producto.findByIdAndUpdate(
                
                id_producto,
                {
                    $pull: {
                        "variedades.$[v].tamano_disponibilidad": { _id: id_caracteristica }
                    }
                },
                {
                    new: true, // Devuelve el documento actualizado
                    arrayFilters: [{ "v._id": id_variedad }],
                    useFindAndModify: false // Para evitar el uso de métodos obsoletos
                }
                /*{
                    _id: id_producto,
                    "variedades._id": id_variedad
                  },
                  {
                    $pull: {
                      "variedades.$.tamano_disponibilidad": { _id: new mongoose.Types.ObjectId(id_caracteristica) }
                    }
                  },
                  { new: true }*/
            );
            console.log(productoActualizado)
            if (!productoActualizado) {
                return res.status(404).send({ message: 'Producto no encontrado' });
            }

            res.status(200).send({
                message: 'Variedad eliminada correctamente',
                data: productoActualizado
            });


        } catch (error) {
            console.log('errror al eliminar',error)
            res.status(500).send({ message: 'Error al eliminar la variedad', error });
        }



    } else {
        res.status(500).send({ message: 'Usuario No Autorizado' });
    }
}



module.exports = {
    login_admin,
    registro_admin,

    //Administración de Clientes
    listar_clientes_admin,
    eliminar_cliente_admin,
    registro_cliente_admin,
    actualizar_cliente_admin,
    obtener_cliente_admin,

    //Administración de productos
    registro_producto_admin,
    listar_productos_admin,
    obtener_producto_admin,
    actualizar_producto_admin,
    get_categorias_admin,

    //Etiquetas deproducto
    //listar_etiquetas_admin,
    //listar_etiquetas_producto_admin,
    //agregar_etiqueta_producto_admin,
   // eliminar_etiqueta_producto_admin,

    //Variedades
    agregar_variedad_producto_admin,
    agregar_imagen_variedad_admin,
    eliminar_imagen_variedad_admin,
    agregar_nueva_variedad_producto_admin,
    eliminar_variedad_producto_admin,
    eliminar_carcateristica_variedad_producto_admin,
            //Carcateristicas de las variedades
            agregar_nueva_caracteristica_variedad_admin,
            editar_caracteristica_variedad_admin,

    //Mensajes
    obtener_mensajes_admin,
    cerrar_mensaje_admin,

}