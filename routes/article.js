'use strict'

const express = require('express');
const ArticleController = require('../controllers/article');

const router = express.Router();

router.get('/test-de-controlador', ArticleController.test);
router.post('/datos-curso', ArticleController.datosCurso);

module.exports = router;