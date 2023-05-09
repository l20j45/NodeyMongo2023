'use strict'

const validator = require('validator');
const ArticleModel = require('../models/Article');

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
    },

//Reales
    save: (req, res) => {
        //recoger dato
        var params = req.body;
        try {
            if (validator.isEmpty(params.title))
                throw new Error(`valor de title esta vacio `);

            if (validator.isEmpty(params.content))
                throw new Error(`valor del content esta vacio `);
            let article = new ArticleModel();
            article.title = params.title;
            article.content = params.content;
            article.image = null;

            article.save((error, articleStored) => {
                try {
                    if (error || !articleStored)
                        throw new Error(`Error en el guardado de la informacion`);
                    return res.status(200).send({
                        status: "success",
                        article: articleStored,
                    });
                } catch (error) {
                    console.log(error);
                    return res.status(400).send({
                        message: error,
                    });
                }
            });
        } catch (error) {
            console.log(error);
            return res.status(200).send({
                message: "Validacion incorrecta" + error,
            });
        }
    },

    getArticles: (req, res) => {
        let query = ArticleModel
            .find({}).sort({id: 1});
        let last = req.params.last;
        if (last || last != undefined) {
            query.sort({date: -1}).limit(5);
        }
        // Find
        query.exec((error, articles) => {
            if (error) {
                return res.status(200).send({
                    status: "success",
                    articles,
                });
            }
            if (error) {
                return res.status(500).send({
                    status: "success",
                    message: "error al devolver los articulos",
                });
            }
            if (!articles) {
                return res.status(404).send({
                    status: "success",
                    message: "no hay articulos para mostrar",
                });
            }

            return res.status(200).send({
                status: "success",
                articles,
            });
        });
    },

    getArticle: (req, res) => {
        // Find
        let articleId = req.params.id;
        ArticleModel.findById(articleId, (error, article) => {
            if (error || !article) {
                return res.status(404).send({
                    status: "success",
                    message: "no hay articulos para mostrar",
                });
            }

            return res.status(200).send({
                status: "success",
                article,
            });
        });
    },
    update: (req, res) => {
        // recoger la idel articulo
        let articleId = req.params.id;
        // recoger los datos que llegan por el put
        let params = req.body;
        // validar los datos
        try {
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
        } catch (error) {
            return res.status(200).send({
                status: "error",
                message: "Faltan datos por enviar !!",
            });
        }

        if (validate_title && validate_content) {
            ArticleModel.findOneAndUpdate(
                {_id: articleId},
                params,
                {new: true},
                (error, articleUpdated) => {
                    if (error)
                        return res.status(500).send({
                            status: "error",
                            message: "Error al actualizar",
                        });

                    if (!articleUpdated)
                        return res.status(404).send({
                            status: "error",
                            message: "articulo no encontrado",
                        });

                    return res.status(200).send({
                        status: "sucess",
                        article: articleUpdated,
                    });
                }
            );
        } else {
            return res.status(200).send({
                status: "error",
                message: "Faltan datos no validos",
            });
        }
        // devolver respuestas
    },
    delete: (req, res) => {
        // recoger id de la url
        let articleId = req.params.id;
        // find and delete
        ArticleModel.findByIdAndDelete({_id: articleId}, (err, articleRemove) => {
            if (err)
                return res.status(401).send({
                    status: "error",
                    message: "Faltan datos no validos",
                });

            if (!articleRemove)
                return res.status(500).send({
                    status: "error",
                    message: "id no encontrado",
                });
            return res.status(200).send({
                status: "sucess",
                message: "metodo delete",
            });
        });
    },
    update: (req, res) => {
        let file_name = "Imagen no subida..";

        let validExtension = ["jpg", "png", "jpeg", "gif"];
        let file_path = req.files.file0.path;
        let file_split = file_path.split("\\");
        file_name = file_split[2];
        let file_extension = file_split[2].split(".")[1];
        if (validExtension.includes(file_extension)) {
            let articleId = req.params.id;
            ArticleModel.findByIdAndUpdate(
                {_id: articleId},
                {image: file_name},
                {new: true},
                (err, articleUpdated) => {
                    if (err || !articleUpdated) {
                        return res.status(400).send({
                            status: "failed",
                            message: "error a guardar la imagen del articulo",
                            err: err,
                        });
                    }

                    return res.status(200).send({
                        status: "success",
                        article: articleUpdated,
                    });
                }
            );
        } else {
            fs.unlink(file_path, (err) => {
                return res.status(500).send({
                    status: "failed",
                    message: "archivo no valido",
                });
            });
        }
    },

    getImage: (req, res) => {
        var file = req.params.image;
        var path_file = "./upload/articles/" + file;

        fs.exists(path_file, (exists) => {
            if (exists) {
                return res.sendFile(path.resolve(path_file));
            } else {
                return res.status(404).send({
                    status: "error",
                    message: "La imagen no existe !!!",
                });
            }
        });
    },

    search: (req, res) => {
        // Sacar el string a buscar
        var searchString = req.params.search;

        // Find or
        ArticleModel.find({
            $or: [
                {title: {$regex: searchString, $options: "i"}},
                {content: {$regex: searchString, $options: "i"}},
            ],
        })
            .sort([["date", "descending"]])
            .exec((err, articles) => {
                if (err) {
                    return res.status(500).send({
                        status: "error",
                        message: "Error en la petición !!!",
                    });
                }

                if (!articles || articles.length <= 0) {
                    return res.status(404).send({
                        status: "error",
                        message: "No hay articulos que coincidan con tu busqueda !!!",
                    });
                }

                return res.status(200).send({
                    status: "success",
                    articles,
                });
            });
    },
};
module.exports = controller;
