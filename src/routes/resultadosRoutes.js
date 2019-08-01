'use strict'

var express = require("express");
var ResultadosController = require("../controllers/resultadosController");
var md_auth = require('../middleware/aunthenticated');

//SUBIR IMAGEN 
var multiparty = require('connect-multiparty');
var md_subir = multiparty({uploadDir: './src/uploads/resultados'});

var api = express.Router();
api.post('/registrar-resultado', ResultadosController.registrar);
api.post('/subir-imagen-resultado/:id', ResultadosController.subirImagenResultado);
api.get('/obtener-imagen-resultado/:imageFile', ResultadosController.getImageFileResultado);
api.put('/editar-resultado/:id', ResultadosController.editarResultado);
api.delete('/eliminar-resultado/:id', ResultadosController.eliminarResultado);
api.get('/listar-resultado/:id', ResultadosController.listarResultado);

module.exports = api;