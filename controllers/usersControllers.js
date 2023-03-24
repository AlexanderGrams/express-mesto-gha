const User = require('../models/userSchema');
const {
  OK,
  CREATED,
  INVALID_DATA,
  NOT_FOUND,
  INTERNAL,
} = require('../utils/resStatus');

// Получить всех пользователей
const getUsers = (req, res) => {
  // Найти всех пользователей в базе данных
  User.find({})
    .then((users) => res.status(OK.CODE).send(users))
    .catch(() => res.status(INTERNAL.CODE).send({ message: INTERNAL.MESSAGE }));
};

// Получить пользователя
const getUser = (req, res) => {
  // Получить id пользователя из URL
  const { userId } = req.params;

  // Найти пользователя по id в базе данных
  User.findById(userId)
    .then((user) => {
      if (!(user)) {
        return res.status(NOT_FOUND.CODE)
          .send({ message: NOT_FOUND.USER_MESSAGE });
      }
      return res.status(OK.CODE).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(INVALID_DATA.CODE)
          .send({ message: INVALID_DATA.MESSAGE });
      }
      return res.status(INTERNAL.CODE).send({ message: INTERNAL.MESSAGE });
    });
};

// Создать нового пользователя
const createUser = (req, res) => {
  // Получить необходимые данные из тела запроса
  const {
    name, about, avatar, email, password,
  } = req.body;

  // Создать нового пользователя в базе данных
  User.create({
    name, about, avatar, email, password,
  })
    .then((user) => res.status(CREATED.CODE).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(INVALID_DATA.CODE)
          .send({ message: INVALID_DATA.MESSAGE });
      }
      return res.status(INTERNAL.CODE).send({ message: INTERNAL.MESSAGE });
    });
};

// Внести изменения в информацию профиля
const patchProfile = (req, res) => {
  // Получить необходимые данные из тела запроса
  const { name, about } = req.body;

  // Получить id пользователя из временного решения авторизации
  const userId = req.user._id;

  // Обновить данные пользователя по соответствующем id в базе данных
  User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND.CODE)
          .send({ message: NOT_FOUND.USER_MESSAGE });
      }
      return res.status(OK.CODE).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(INVALID_DATA.CODE)
          .send({ message: INVALID_DATA.MESSAGE });
      }
      return res.status(INTERNAL.CODE).send({ message: INTERNAL.MESSAGE });
    });
};

// Изменить аватар
const patchAvatar = (req, res) => {
  // Получить необходимые данные из тела запроса
  const { avatar } = req.body;

  // Получить id пользователя из временного решения авторизации
  const userId = req.user._id;

  // Обновить данные пользователя по соответствующем id в базе данных
  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND.CODE)
          .send({ message: NOT_FOUND.USER_MESSAGE });
      }
      return res.status(OK.CODE).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(INVALID_DATA.CODE)
          .send({ message: INVALID_DATA.MESSAGE });
      }
      return res.status(INTERNAL.CODE).send({ message: INTERNAL.MESSAGE });
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  patchProfile,
  patchAvatar,
};
