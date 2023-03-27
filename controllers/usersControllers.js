const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');

const User = require('../models/userSchema');
const {
  OK,
  CREATED,
  INVALID_DATA,
  NOT_FOUND,
  INTERNAL,
  UNAUTHORIZED,
} = require('../utils/resStatus');
const { JWT_SECRET } = require('../config');

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

// Получить информацию об авторизированном пользователе
const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.status(OK.CODE).send(user);
      } else {
        next({ statusCode: NOT_FOUND.CODE, message: NOT_FOUND.USER_MESSAGE });
      }
    })
    .catch(next);
};

// Создать нового пользователя
const createUser = (req, res) => {
  // Получить необходимые данные из тела запроса
  const {
    name, about, avatar, email, password,
  } = req.body;

  // Хешировать пороль
  bcrypt.hash(password, 10)
    // Создать пользователся
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
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

// Авторизация
const login = (req, res) => {
  // Получить необходимые данные из тела запроса
  const { email, password } = req.body;

  User.findOne({ email })
    .orFail(() => res.status(UNAUTHORIZED.CODE).send({ message: UNAUTHORIZED.PASSWORD_MESSAGE }))
    .then((user) => bcrypt.compare(password, user.password)
      .then((matched) => {
        if (matched) {
          return user;
        }
        return res.status(UNAUTHORIZED.CODE).send({ message: UNAUTHORIZED.PASSWORD_MESSAGE });
      }))
    .then((user) => {
      const jwt = jsonwebtoken.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.status(OK.CODE)
        .cookie('jwt', jwt, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true,
        })
        .send({ _id: user._id, jwt });
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
  getCurrentUser,
  login,
  createUser,
  patchProfile,
  patchAvatar,
};
