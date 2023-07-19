const router = require('express').Router();
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

router.post('/signin', login);
router.post('/signup', createUser);

router.use(auth);

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', getUser);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
