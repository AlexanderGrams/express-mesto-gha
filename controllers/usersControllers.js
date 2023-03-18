const User = require('../models/userSchema')

const getUsers = (req, res) => {
  User.find({})
    .then(users => res.status(200).send(users))
    .catch((err) => {
      if(err.name === "ValidationError"){
        return res.status(400).send({ message: `Переданы некорректные данные при создании пользователя.`})
      }
      res.status(500).send({ message: `Произошла ошибка ${err.message}` })
    })
};

const getUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
      .then(user => {res.status(200).send(user)})
      .catch((err) => {
        if(err.name === "CastError"){
          return res.status(404).send({ message: `Пользователь по указанному _id не найден` })
        }
        res.status(500).send({ message: `Произошла ошибка ${err.message}` })
      });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then(user => res.status(200).send(user))
    .catch((err) => {
      if(err.name === "ValidationError"){
        return res.status(400).send({ message: `Переданы некорректные данные при создании пользователя.`})
      }
      res.status(500).send({ message: `Произошла ошибка ${err.message}` })
    })
};

const patchProfile = (req, res) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { name: name, about: about }, {new: true})
    .then(user => {
      if(!user){
        return res.status(404).send({ message: `Пользователь по указанному _id не найден`})
      }
      if(!name || !about){
        return res.status(400).send({ message: `Переданы некорректные данные при обновлении профиля.`})
      }
      res.status(200).send({ data: user })
    })
    .catch((err) => {
      res.status(500).send({ message: `Произошла ошибка ${err.message}` })
    })
}

const patchAvatar = (req,res) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { avatar: avatar }, {new: true})
      .then(user => {
        if(!user){
          return res.status(404).send({ message: `Пользователь по указанному _id не найден`})
        }
        if(!avatar){
          return res.status(400).send({ message: `Переданы некорректные данные при обновлении аватара.`})
        }
        res.status(200).send({ data: user })
      })
      .catch((err) => {
        res.status(500).send({ message: `Произошла ошибка ${err.message}` })
      })
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  patchProfile,
  patchAvatar
};