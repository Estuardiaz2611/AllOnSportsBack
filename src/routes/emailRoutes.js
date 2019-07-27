'use strict'

var express = require("express");
var UserController = require("../controllers/emailController");
var md_auth = require('../middleware/aunthenticated');

var api = express.Router();
api.post('/api/contacto')

module.exports = api;