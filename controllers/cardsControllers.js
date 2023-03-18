const Card = require('../models/cardSchema')

const getCards = (req, res) => {
  Card.find({})
    .then(cards => res.status(200).send(cards))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка ${err}` }));
};

const createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner })
    .then(card => res.status(200).send(card))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка ${err} при создании карточки` }))
};


const deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndRemove(cardId)
      .then(card => {res.status(200).send(card)})
      .catch((err) => res.status(500).send({ message: `Произошла ошибка ${err}` }));
};

const likeCard = (req, res) => {
  const { cardId } = req.params
  const userId = req.user._id

  Card.findByIdAndUpdate(cardId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .then(card => {res.status(200).send(card)})
    .catch((err) => res.status(500).send({ message: `Произошла ошибка ${err}` }));
}

const dislikeCard = (req, res) => {
  const { cardId } = req.params
  const userId = req.user._id

  Card.findByIdAndUpdate(cardId,
    { $pull: { likes: userId } },
    { new: true },
  )
    .then(card => {res.status(200).send(card)})
    .catch((err) => res.status(500).send({ message: `Произошла ошибка ${err}` }));
}

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard
};