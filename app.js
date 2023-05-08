'use strict'

//cargar modulos de node para crear servidor
const express = require('express');;
const bodyParser = require('body-parser');
const articleRoutes = require('./routes/article');

// ejecutar express (http)

var app = express();

// cargar ficheros rutas

// cargar middlewares
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// activar el cors

// añadir prefijos a rutas

app.use('/',articleRoutes);


//ruta o metodo de prueba



/*
app.get('/probando', (req,res) =>{
    return res.status(200).send({
        curso:'generico',
        autor:'generico',
        url:'generico'

    })

})/*/





// exportar modulo
module.exports = app;