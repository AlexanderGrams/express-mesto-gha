const Card = require('../models/cardSchema');
const {
  OK,
  CREATED,
  INVALID_DATA,
  NOT_FOUND,
  INTERNAL,
} = require('../utils/resStatus');

//  Получить все карточки
const getCards = (req, res) => {
  // Найти все карточки в базе данных
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.status(OK.CODE).send(cards))
    .catch(() => res.status(INTERNAL.CODE).send({ message: INTERNAL.MESSAGE }));
};

// Создать карточку
const createCard = (req, res) => {
  // Получить id пользователя из URL
  const owner = req.user._id;

  // Получить необходимые данные из тела запроса
  const { name, link } = req.body;

  // Создать новую крточку в базе данных
  Card.create({ name, link, owner })
    .then((card) => res.status(CREATED.CODE).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(INVALID_DATA.CODE)
          .send({ message: INVALID_DATA.MESSAGE });
      }
      return res.status(INTERNAL.CODE).send({ message: INTERNAL.MESSAGE });
    });
};

// Удалить карточку
const deleteCard = (req, res, next) => {
  // Получить id карточки из URL
  const { cardId } = req.params;

  // Получить id пользователя из cocke
  const userId = req.user._id;

  // Найти и удалить карточку по id в базе данных
  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND.CODE)
          .send({ message: NOT_FOUND.CARD_MESSAGE });
      }
      if (userId !== String(card.owner)) {
        return res.status(403).send({ message: 'Нет прав для удаления этой карточки' });
      }
      return card.deleteOne();
    })
    .then((deletedСard) => {
      res.status(OK.CODE).send({ deletedСard });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(INVALID_DATA.CODE)
          .send({ message: INVALID_DATA.MESSAGE });
      }
      return res.status(INTERNAL.CODE).send({ message: INTERNAL.MESSAGE });
    });
};

// Поставить лайк карточке
const likeCard = (req, res) => {
  // Получить id карточки из URL
  const { cardId } = req.params;

  // Получить id пользователя из cocke
  const userId = req.user._id;

  // Добавить в массив пользователей лайкнувших карточку унакального пользователя
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND.CODE)
          .send({ message: NOT_FOUND.CARD_MESSAGE });
      }
      return res.status(OK.CODE).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(INVALID_DATA.CODE)
          .send({ message: INVALID_DATA.MESSAGE });
      }
      return res.status(INTERNAL.CODE).send({ message: INTERNAL.MESSAGE });
    });
};

// Убрать лайк с карточки
const dislikeCard = (req, res) => {
  // Получить id карточки из URL
  const { cardId } = req.params;

  // Получить id пользователя из cocke
  const userId = req.user._id;

  // Удалить пользователя из массива унакальных пользователей лайкнувших карточку
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: userId } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND.CODE)
          .send({ message: NOT_FOUND.CARD_MESSAGE });
      }
      return res.status(OK.CODE).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(INVALID_DATA.CODE)
          .send({ message: INVALID_DATA.MESSAGE });
      }
      return res.status(INTERNAL.CODE).send({ message: INTERNAL.MESSAGE });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
