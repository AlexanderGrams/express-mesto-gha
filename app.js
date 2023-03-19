const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');

const { PORT = 3000 } = process.env;

// Подключение к базе данных
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
})
  .then(() => console.log('соединение установленно!'))
  .catch(() => console.log('нет соединение!'));

const app = express();

// Парсинг приходящих данных со стороны клиента
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Временное решение авторизации
app.use((req, res, next) => {
  req.user = {
    _id: '641596a2b929a25343e89926',
  };

  next();
});

// Роутинг
app.use(routes);

app.listen(PORT, () => {
  console.log(`Сервер запустился!!! Работает на порту - ${PORT}`);
});
