const jwt = require('jsonwebtoken');
const { AuthorizationError } = require('../errors/authorization-error');

module.exports.auth = (req, res, next) => {
  const { jwtToken } = req.cookies;
  if (!jwtToken) {
    throw new AuthorizationError('Ошибка авторизации');
  }
  let payload;
  try {
    payload = jwt.verify(jwtToken, 'user-secret-key');
  } catch (error) {
    next(error);
  }
  req.user = payload;

  next();
};
