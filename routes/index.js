const routes = require('express').Router();
const mongoose = require('mongoose');
const { errorCatch } = require('../utils/helpers');

routes.use('/users', require('./users'));
routes.use('/cards', require('./cards'));

routes.use('*', (req, res) => errorCatch(new mongoose.Error.DocumentNotFoundError(), res));
module.exports = routes;
