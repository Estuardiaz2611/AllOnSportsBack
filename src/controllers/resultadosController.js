'use strict'

var Resultado = require('../models/resultados');
var path = require('path');
var fs = require('fs');

function registrarResultado(req, res) {
    var resultado = new Resultado();
    var params = req.body;

    if (params.descripcion) {
        resultado.descripcion = params.descripcion;
        resultado.image = null;
        resultado.usuario = req.user.sub;


        Partido.find({
            $or: [
                { descripcion: resultado.descripcion.toLowerCase() }
            ]
        }).exec((err, users) => {
            if (err) return res.status(500).send({ message: 'Error en la peticion de resultado' })

            else {
                resultado.save((err, resultadoGuardado) => {
                    if (err) return res.status(500).send({ message: 'Error a la hora de guardar el resultado' })

                    if (resultadoGuardado) {
                        res.status(200).send({ resultado: resultadoGuardado })
                    } else {
                        res.status(404).send({ message: 'no se a podido registrar el resultado' })
                    }
                });
            }
        });
    } else {
        return res.status(200).send({ message: 'rellene los datos necesarios' })
    }
}

function subirImagenResultado(req, res) {
    var resultadoId = req.params.id;

    if (req.files) {
        var file_path = req.files.image.path;
        console.log(file_path);

        var file_split = file_path.split('\\');
        console.log(file_split);

        var file_name = file_split[3];
        console.log(file_name);

        var ext_xplit = file_name.split('\.');
        console.log(ext_xplit);

        var file_ext = ext_xplit[1];
        console.log(file_ext);

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') {
            Resultado.findByIdAndUpdate(resultadoId, { image: file_name }, { new: true }, (err, resultadoActualizado) => {
                if (err) return res.status(500).send({ message: 'Error en la peticion' })

                if (!resultadoActualizado) return res.status(404).send({ message: 'no se a podido actualizar el resultado' })

                return res.status(200).send({ resultado: resultadoActualizado })
            });
        } else {
            return removeFilerOfUploads(res, file_path, 'Extension no valida')
        }
    }
}

function removeFilerOfUploads(res, file_path, message) {
    fs.unlink(file_path, (err) => {
        return res.status(200).send({ message: message })
    });
}

function getImageFileResultado(req, res) {
    var image_file = req.params.imageFile;
    var path_file = './src/uploads/resultados/' + image_file;

    fs.exists(path_file, (exists) => {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({ message: 'no existe la imagen' })
        }
    });
}

function editarResultado(req, res) {
    var resultadoId = req.params.id;
    var params = req.body;

    Resultado.findByIdAndUpdate(resultadoId, params, { new: true }, (err, resultadoActualizado) => {
        if (err) return res.status(500).send({ message: 'error en la peticion' });

        if (!resultadoActualizado) return res.status(404).send({ message: 'no se a podido actualizar el resultado' });

        return res.status(200).send({ resultado: resultadoActualizado });
    });
}

function eliminarResultado(req, res) {
    var resultadoId = req.params.id;

    Resultado.findByIdAndDelete(resultadoId, (err, resultadoEliminado) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' });

        if (!resultadoEliminado) return res.status(404).send({ message: 'No se ha podido eliminar el resultado' });

        return res.status(200).send({ resultado: resultadoEliminado });
    });
}


function listarResultado(req, res) {
    Resultado.find((err, ResultadosEncontrados) => {
        if (err) return res.status(500).send({ message: 'Error en la petición' });

        if (!ResultadosEncontrados) return res.status(404).send({ message: 'No se han podido listar Resultados' });

        return res.status(200).send({ resultado: ResultadosEncontrados });
    });
}

function getResultado(req, res) {
    var resultadoId = req.params.id;

    Resultado.findById(resultadoId, (err, resultadoEncontrado) => {
        if (err) return res.status(500).send({ message: 'Error en la petición' });

        if (!resultadoEncontrado) return res.status(404).send({ message: 'No se ha podido encontrar Resultados' });

        return res.status(200).send({ resultado: resultadoEncontrado });
    });
}


module.exports = {
    registrarResultado,
    subirImagenResultado,
    getImageFileResultado,
    editarResultado,
    listarResultado,
    getResultado,
    eliminarResultado
}