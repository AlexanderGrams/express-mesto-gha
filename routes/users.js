const router = require('express').Router();
const {
  getUsers, getUser, createUser, patchProfile, patchAvatar,
} = require('../controllers/usersControllers');

router.get('/', getUsers);

router.get('/:userId', getUser);

router.post('/', createUser);

router.patch('/me', patchProfile);

router.patch('/me/avatar', patchAvatar);

module.exports = router;
