"use strict";

const mongoose = require("mongoose");
const app=require('./app');
const port = 3900
require('dotenv').config()


mongoose.set('strictQuery', true);
mongoose.Promise = global.Promise;
const options = {useNewUrlParser: true, useUnifiedTopology: true};
mongoose
    .connect(process.env.MongoConnection,
        options)
    .then(() => {
        console.log("conexion exitosa a la base de datos");
        //crear servidor y escuchar peticiones
        app.listen(port,()=> {
            console.log('Servidor corrriendo en localhost ' + port)
        })
    })
    .catch(() => {
        console.log("Conexion erronea")
    }
);

