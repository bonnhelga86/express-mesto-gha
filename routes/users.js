const router = require('express').Router();
const {
  userIdValidator,
  updateUserValidator,
  updateAvatarValidator,
} = require('../middlewares/userValidator');
const {
  getUsers,
  getCurrentUser,
  getUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', userIdValidator, getUser);
router.patch('/me', updateUserValidator, updateUser);
router.patch('/me/avatar', updateAvatarValidator, updateAvatar);

module.exports = router;
