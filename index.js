"use strict";

const mongoose = require("mongoose");
require('dotenv').config()


mongoose.set('strictQuery', true);
mongoose.Promise = global.Promise;
const options = {useNewUrlParser: true, useUnifiedTopology: true};
mongoose
    .connect(process.env.MongoConnection,
        options)
    .then(() => {
        console.log("conexion exitosa a la base de datos");
    })
    .catch(() => {
        console.log("Conexion erronea")
    }
);

