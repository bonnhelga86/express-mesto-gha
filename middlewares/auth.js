const jwt = require('jsonwebtoken');
const { errorCatch } = require('../utils/helpers');

module.exports.auth = (req, res, next) => {
  const { jwtToken } = req.cookies;
  if (!jwtToken) {
    const error = new Error();
    error.name = 'AuthorizationError';
    throw error;
  }
  let payload;
  try {
    payload = jwt.verify(jwtToken, 'user-secret-key');
  } catch (error) {
    errorCatch(error, res);
  }
  req.user = payload;

  next();
};
