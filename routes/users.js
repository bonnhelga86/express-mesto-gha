const router = require('express').Router();
// const { celebrate, Joi } = require('celebrate');
const {
  loginValidator,
  createUserValidator,
  userIdValidator,
  updateUserValidator,
  updateAvatarValidator,
} = require('../middlewares/userValidator');
const { auth } = require('../middlewares/auth');
const {
  getUsers,
  getCurrentUser,
  getUser,
  login,
  createUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

router.post('/signin', loginValidator, login);
router.post('/signup', createUserValidator, createUser);

router.use(auth);

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', userIdValidator, getUser);
router.patch('/me', updateUserValidator, updateUser);
router.patch('/me/avatar', updateAvatarValidator, updateAvatar);

module.exports = router;
