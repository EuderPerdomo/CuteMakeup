'use strict'

var express = require('express');
var bodyparser = require('body-parser');
var mongoose = require('mongoose');
var port = process.env.PORT || 4201;
var app = express();

var server = require('http').createServer(app);

//Todas las peticiones sean desde cualquier URL se pone *
var io = require('socket.io')(server,{
    cors: {origin : '*'}
});


io.on('connection',function(socket){
    socket.on('delete-carrito',function(data){
        io.emit('new-carrito',data);
        console.log(data);
    });


    socket.on('add-carrito-add',function(data){
        io.emit('new-carrito-add',data);
        console.log(data);
    });
    
});


var cliente_routes = require('./routes/cliente');
var admin_routes = require('./routes/admin');
var config_routes = require('./routes/config');
var producto_routes = require('./routes/producto');
var carrito_routes = require('./routes/carrito');

const connectDB = async () => {
    try {
      await mongoose.connect('mongodb://127.0.0.1:27017/cuteMakeup', {
        //useUnifiedTopology: true,
        //useNewUrlParser: true
      });
      console.log("Conectado a la base de datos...");
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  };
  
  connectDB().then(() => {
    server.listen(port, () => { // app.listen(port, () => {
      console.log(`Servidor corriendo en el puerto ${port}`);
    });
  });

app.use(bodyparser.urlencoded({limit: '50mb',extended:true}));
app.use(bodyparser.json({limit: '50mb', extended: true}));


app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*'); 
    res.header('Access-Control-Allow-Headers','Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods','GET, PUT, POST, DELETE, OPTIONS');
    res.header('Allow','GET, PUT, POST, DELETE, OPTIONS');
    next();
});

app.use('/api',cliente_routes);
app.use('/api',admin_routes);
app.use('/api',config_routes)
app.use('/api',producto_routes);
app.use('/api',carrito_routes);

module.exports = app;