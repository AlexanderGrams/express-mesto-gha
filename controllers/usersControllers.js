const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');

const InaccurateDataError = require('../errors/InaccurateDataError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const User = require('../models/userSchema');
const { JWT_SECRET } = require('../config');

// Получить всех пользователей
const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

// Получить пользователя
const getUser = (req, res, next) => {
  // Получить id пользователя из URL
  const { userId } = req.params;

  // Найти пользователя по id в базе данных
  User.findById(userId)
    .then((user) => {
      if (!(user)) {
        throw next(new NotFoundError('Пользователь не найден'));
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new InaccurateDataError('Переданы некорректные данные'));
      }
      next();
    });
};

// Получить информацию об авторизированном пользователе
const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        return res.send(user);
      }
      throw next(new NotFoundError('Пользователь не найден'));
    })
    .catch(next);
};

// Создать нового пользователя
const createUser = (req, res, next) => {
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
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким электронным адресом уже зарегистрирован'));
      }
      if (err.name === 'ValidationError') {
        next(new InaccurateDataError('Переданы некорректные данные'));
      }
      next();
    });
};

// Внести изменения в информацию профиля
const patchProfile = (req, res, next) => {
  // Получить необходимые данные из тела запроса
  const { name, about } = req.body;

  // Получить id пользователя из временного решения авторизации
  const userId = req.user._id;

  // Обновить данные пользователя по соответствующем id в базе данных
  User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw next(new NotFoundError('Пользователь не найден'));
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new InaccurateDataError('Переданы некорректные данные'));
      }
      next();
    });
};

// Изменить аватар
const patchAvatar = (req, res, next) => {
  // Получить необходимые данные из тела запроса
  const { avatar } = req.body;

  // Получить id пользователя из временного решения авторизации
  const userId = req.user._id;

  // Обновить данные пользователя по соответствующем id в базе данных
  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw next(new NotFoundError('Пользователь не найден'));
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new InaccurateDataError('Переданы некорректные данные'));
      }
      next();
    });
};

// Авторизация
const login = (req, res, next) => {
  // Получить необходимые данные из тела запроса
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .orFail(() => next(new UnauthorizedError('Неправильные почта или пароль')))
    .then((user) => bcrypt.compare(password, user.password)
      .then((matched) => {
        if (matched) {
          return user;
        }
        throw next(new UnauthorizedError('Неправильные почта или пароль'));
      }))
    .then((user) => {
      const jwt = jsonwebtoken.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.cookie('jwt', jwt, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      })
        .send({ _id: user._id, jwt });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new InaccurateDataError('Переданы некорректные данные'));
      }
      next();
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
