'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'CuteMakeup2024_v1';

exports.createToken = function(user){
    console.log('Creacion de token',user,user.rol, user.apellidos)
    var payload = {
        sub: user._id,
        nombres: user.nombres,
        apellidos: user.apellidos,
        email: user.email,
        role:user.rol,
        iat: moment().unix(), //Tiempo de creación del token
        exp: moment().add(1,'day').unix()//Tiempo de expiración del token
    }

    return jwt.encode(payload,secret);
}