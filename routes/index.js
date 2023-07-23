const routes = require('express').Router();
const {
  loginValidator,
  createUserValidator,
} = require('../middlewares/userValidator');
const { NotFoundError } = require('../errors/not-found-error');

router.post('/signin', loginValidator, login);
router.post('/signup', createUserValidator, createUser);

routes.use('/users', require('./users'));
routes.use('/cards', require('./cards'));

routes.use('*', () => {
  throw new NotFoundError('Страница не найдена');
});
module.exports = routes;
