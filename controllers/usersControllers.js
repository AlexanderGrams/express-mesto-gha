const User = require('../models/userSchema')

const getUsers = (req, res) => {
  User.find({})
    .then(users => res.status(200).send(users))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

const getUser = (req, res) => {
  const { userId } = req.params;

  if (!User[userId]) {
    res.status(200).send(`Такого пользователя не существует`);
    return;
  }

  User.findById(userId)
      .then(user => {res.status(200).send(user)})
      .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

const createUser = (req, res) => {
  console.log(req.body)
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then(user => res.status(200).send(user))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка при создании пользователся' }))
};

module.exports = {
  getUsers,
  getUser,
  createUser
};