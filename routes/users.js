const router = require('express').Router();
const {
  getUsers, getUser, getCurrentUser, login, createUser, patchProfile, patchAvatar,
} = require('../controllers/usersControllers');
const auth = require('../middlewares/auth');

router.post('/signin', login);
router.post('/signup', createUser);

// Проверка авторизации
router.use(auth);

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', getUser);
router.patch('/me', patchProfile);
router.patch('/me/avatar', patchAvatar);

module.exports = router;
