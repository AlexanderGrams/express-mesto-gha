const User = require('../models/userSchema')

const getUsers = (req, res) => {
  User.find({})
    .then(users => res.status(200).send(users))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка ${err}` }));
};

const getUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
      .then(user => {res.status(200).send(user)})
      .catch((err) => res.status(500).send({ message: `Произошла ошибка ${err}` }));
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then(user => res.status(200).send(user))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка ${err} при создании пользователся` }))
};

const patchProfile = (req, res) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { name: name, about: about })
      .then(user => res.send({ data: user }))
      .catch((err) => res.status(500).send({ message: `Произошла ошибка ${err}` }));
}

const patchAvatar = (req,res) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { avatar: avatar })
      .then(user => res.send({ data: user }))
      .catch((err) => res.status(500).send({ message: `Произошла ошибка ${err}` }));
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  patchProfile,
  patchAvatar
};