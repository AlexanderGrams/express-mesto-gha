const ResStatus = {
  OK: {
    CODE: 200,
    MESSAGE: 'Запрос успешно выполнен',
    DEL_CARD_MESSAGE: 'Карточка удалена',
    LIKE_CARD_MESSAGE: 'Лайк добавлен',
    DISLIKE_CARD_MESSAGE: 'Лайк удален',
  },
  CREATED: {
    CODE: 201,
    MESSAGE: 'Объект успешно создан',
  },
  NOT_FOUND: {
    CODE: 404,
    USER_MESSAGE: 'Пользователь не найден',
    CARD_MESSAGE: 'Карточка не найдена',
    PAGE_MESSAGE: 'Страницы не существует',
  },
  INVALID_DATA: {
    CODE: 400,
    MESSAGE: 'Переданы некорректные данные',
  },
  INTERNAL: {
    CODE: 500,
    MESSAGE: 'Произошла ошибка',
  },
};

module.exports = ResStatus;
