const router = require('express').Router();
const {
  loginValidator,
  createUserValidator,
} = require('../middlewares/userValidator');
const {
  login,
  createUser,
} = require('../controllers/users');
const { auth } = require('../middlewares/auth');

const { NotFoundError } = require('../errors/not-found-error');

router.post('/signin', loginValidator, login);
router.post('/signup', createUserValidator, createUser);

router.use(auth);

router.use('/users', require('./users'));
router.use('/cards', require('./cards'));

router.use('*', () => {
  throw new NotFoundError('Страница не найдена');
});
module.exports = router;
