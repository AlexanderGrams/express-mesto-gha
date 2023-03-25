const router = require('express').Router();
const {
  getUsers, getUser, login, createUser, patchProfile, patchAvatar,
} = require('../controllers/usersControllers');

router.get('/', getUsers);

router.get('/:userId', getUser);

router.post('/signin', login);

router.post('/signup', createUser);

router.patch('/me', patchProfile);

router.patch('/me/avatar', patchAvatar);

module.exports = router;
