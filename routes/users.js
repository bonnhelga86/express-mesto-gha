const router = require('express').Router();
const {
  loginValidator,
  createUserValidator,
  updateUserValidator,
} = require('../middlewares/validation');
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
router.get('/:userId', getUser);
router.patch('/me', updateUserValidator, updateUser);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
