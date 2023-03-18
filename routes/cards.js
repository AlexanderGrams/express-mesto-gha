const router = require('express').Router();
const { getCards, createCard, deleteCard} = require('../controllers/cardsControllers');

router.get('/', getCards);

router.post('/', createCard);

router.delete('/:cardId', deleteCard);

module.exports = router;