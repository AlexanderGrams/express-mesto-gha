const jsonwebtoken = require('jsonwebtoken');

const { JWT_SECRET } = require('../config');

const auth = (req, res, next) => {
  const { jwt } = req.cookies;

  if (!jwt) {
    res.status(401).send({ message: 'Необходима авторизация' });
  }

  let payload;
  try {
    payload = jsonwebtoken.verify(jwt, JWT_SECRET);
  } catch (err) {
    res.status(401).send({ message: 'Необходима авторизация' });
  }

  req.user = {
    _id: payload._id,
  };
  // console.log(next());
  next();
};

module.exports = auth;
