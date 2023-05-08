'use strict'

const controller = {
    datosCurso: (req, res) => {

        return res.status(200).send({
            curso: 'generico',
            autor: 'generico',
            url: 'generico'

        })
    },
    test: (req, res) => {
        return res.status(200).send({
            message: 'Soy el metodo test'
        });
    }

}

module.exports = controller;
