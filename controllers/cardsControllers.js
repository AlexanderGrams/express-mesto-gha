const Card = require('../models/cardSchema')

const getCards = (req, res) => {
  Card.find({})
    .then(cards => res.status(200).send(cards))
    .catch((err) => {
      if(err.name === "ValidationError"){
        return res.status(400).send({ message: `Переданы некорректные данные при создании карточки.`})
      }
      res.status(500).send({ message: `Произошла ошибка ${err.message}` })
    })
};

const createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner })
    .then(card => res.status(200).send(card))
    .catch((err) => {
      if(err.name === "ValidationError"){
        return res.status(400).send({ message: `Переданы некорректные данные при создании карточки.`})
      }
      res.status(500).send({ message: `Произошла ошибка ${err.message}` })
    })
};


const deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndRemove(cardId)
    .then(card => {
      if(!card){
        return res.status(404).send({ message: `Карточка по указанному _id не найден`})
      }
      res.status(200).send({ data: card })
    })
    .catch((err) => {
      if(err.name === "CastError"){
        return res.status(400).send({ message: `Переданы некорректные данные id карточки` })
      }
      res.status(500).send({ message: `Произошла ошибка ${err.message}` })
    });
};

const likeCard = (req, res) => {
  const { cardId } = req.params
  const userId = req.user._id

  Card.findByIdAndUpdate(cardId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .then(card => {
      if(!card){
        return res.status(404).send({ message: `Карточка по указанному _id не найден`})
      }
      res.status(200).send({ data: card })
    })
    .catch((err) => {
      if(err.name === "CastError"){
        return res.status(400).send({ message: `Переданы некорректные данные id карточки` })
      }
      res.status(500).send({ message: `Произошла ошибка ${err.message}` })
    })
}

const dislikeCard = (req, res) => {
  const { cardId } = req.params
  const userId = req.user._id

  Card.findByIdAndUpdate(cardId,
    { $pull: { likes: userId } },
    { new: true },
  )
    .then(card => {
      if(!card){
        return res.status(404).send({ message: `Карточка по указанному _id не найден`})
      }
      res.status(200).send({ data: card })
    })
    .catch((err) => {
      if(err.name === "CastError"){
        return res.status(400).send({ message: `Переданы некорректные данные id карточки` })
      }
      res.status(500).send({ message: `Произошла ошибка ${err.message}` })
    })
}

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard
};