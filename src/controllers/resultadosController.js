'use strict'

var Resultados = require('../models/resultados');
var path = require('path');
var fs = require('fs');

function registrarResultado(req, res) {
    var resultados = new Resultados();
    var params = req.body;

    if (params.descripcion) {
        partido.descripcion = params.descripcion;
        partido.image = null;

        Partido.find({
            $or: [
                { descripcion: resultados.descripcion.toLowerCase() }
            ]
        }).exec((err, users) => {
            if (err) return res.status(500).send({ message: 'Error en la peticion de resultado' })

            else {
                resultados.save((err, resultadosGuardado) => {
                    if (err) return res.status(500).send({ message: 'Error a la hora de guardar el resultado' })

                    if (resultadosGuardado) {
                        res.status(200).send({ partido: resultadosGuardado })
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
    var resultadosId = req.params.id;

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
            Resultados.findByIdAndUpdate(resultadosId, { image: file_name }, { new: true }, (err, resultadosActualizado) => {
                if (err) return res.status(500).send({ message: 'Error en la peticion' })

                if (!resultadosActualizado) return res.status(404).send({ message: 'no se a podido actualizar el resultado' })

                return res.status(200).send({ resultados: resultadosActualizado })
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
    var resultadosId = req.params.id;
    var params = req.body;

    Resultados.findByIdAndUpdate(resultadosId, params, { new: true }, (err, resultadosActualizado) => {
        if (err) return res.status(500).send({ message: 'error en la peticion' });

        if (!resultadosActualizado) return res.status(404).send({ message: 'no se a podido actualizar el resultado' });

        return res.status(200).send({ resultados: resultadosActualizado });
    });
}

function eliminarResultado(req, res) {
    var resultadosId = req.params.id;

    Resultados.findByIdAndDelete(resultadosId, (err, resultadoEliminado) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' });

        if (!resultadoEliminado) return res.status(404).send({ message: 'No se ha podido eliminar el resultado' });

        return res.status(200).send({ resultados: resultadosEliminado });
    });
}


function listarResultado(req, res) {
    Resultados.find((err, ResultadosEncontrados) => {
        if (err) return res.status(500).send({ message: 'Error en la petición' });

        if (!ResultadosEncontrados) return res.status(404).send({ message: 'No se han podido listar Resultados' });

        return res.status(200).send({ resultados: ResultadosEncontrados });
    });
}

function getResultado(req, res) {
    var resultadosId = req.params.id;

    Resultados.findById(resultadosId, (err, resultadosEncontrado) => {
        if (err) return res.status(500).send({ message: 'Error en la petición' });

        if (!resultadosEncontrado) return res.status(404).send({ message: 'No se ha podido encontrar Resultados' });

        return res.status(200).send({ resultados: resultadosEncontrado });
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