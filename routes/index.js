const router = require('express').Router();
const ResStatus = require('../utils/resStatus');

const userRoutes = require('./users');
const cardRoutes = require('./cards');

// Все доступные роуты страницы
router.use('/users', userRoutes);
router.use('/cards', cardRoutes);

// обработка ошибки, если введен несуществующий URL
router.use((req, res) => {
  res.status(ResStatus.NOT_FOUND.CODE).send({ message: ResStatus.NOT_FOUND.PAGE_MESSAGE });
});

module.exports = router;
