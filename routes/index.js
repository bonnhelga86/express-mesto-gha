const routes = require('express').Router();
const { NotFoundError } = require('../errors/not-found-error');

routes.use('/users', require('./users'));
routes.use('/cards', require('./cards'));

routes.use('*', () => {
  throw new NotFoundError('Страница не найдена');
});
module.exports = routes;
