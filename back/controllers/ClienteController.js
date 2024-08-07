'use-stric'

var Cliente = require('../models/cliente')
var bcrypt = require('bcrypt-nodejs')
var jwt = require('../helpers/jwt')

var Direccion = require('../models/direccion')

const registro_cliente = async function (req, res) {
    var data = req.body;
    var clientes_arr = [];

    clientes_arr = await Cliente.find({ email: data.email });
    console.log(data);

    if (clientes_arr.length == 0) {
        if (data.password) {
            bcrypt.hash(data.password, null, null, async function (err, hash) {
                if (hash) {
                    data.password = hash;

                    try {
                        var reg = await Cliente.create(data);
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

const login_cliente = async function (req, res) {
    console.log('login ClIENTE')
    var data = req.body;
    var cliente_arr = [];

    cliente_arr = await Cliente.find({ email: data.email });
    console.log('cliente encontrado para login', cliente_arr)

    if (cliente_arr.length == 0) {
        res.status(200).send({ message: 'Usuario no registrado', data: undefined });
    } else {
        //LOGIN
        let user = cliente_arr[0];
        bcrypt.compare(data.password, user.password, async function (error, check) {
            if (check) {
                /*
                                if(data.carrito.length >= 1){
                                    for(var item of data.carrito){
                                        await Carrito.create({
                                            cantidad:item.cantidad,
                                            producto:item.producto._id,
                                            variedad:item.variedad.id,
                                            cliente:user._id
                                        });
                                    }
                                }
                */
                res.status(200).send({
                    data: user,
                    token: jwt.createToken(user)
                });
            } else {
                res.status(200).send({ message: 'Las credenciales no coincide', data: undefined });
            }
        });

    }
}

const obtener_cliente_guest = async function (req, res) {

    if (req.user) {
        var id = req.params['id']
        console.log('obtner cliente', id)
        try {
            var reg = await Cliente.findById({ _id: id })
            res.status(200).send({ data: reg })
        } catch (error) {
            res.status(200).send({ data: undefined })
        }
    } else {
        res.status(500).send({ message: 'NO acces' })
    }
}


/**>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Direcciones  */
const registro_direccion_cliente = async function (req, res) {
    if (req.user) {

        var data = req.body
        let reg = await Direccion.create(data)
        res.status(200).send({ data: reg })
    }
    else {
        res.status(500).send({ message: 'NO acces' })
    }
}

module.exports = {
    registro_cliente,
    login_cliente,
    obtener_cliente_guest,

    //Direcciones
    registro_direccion_cliente,
}