const router = require('express').Router();
const {
  getUsers, getUser, getCurrentUser, patchProfile, patchAvatar,
} = require('../controllers/usersControllers');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', getUser);
router.patch('/me', patchProfile);
router.patch('/me/avatar', patchAvatar);

module.exports = router;
