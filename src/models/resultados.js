'use strict'

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ResultadosSchema = Schema({
    descripcion: String,
    image: String,
    usuario: { type: Schema.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Resultado', ResultadosSchema)