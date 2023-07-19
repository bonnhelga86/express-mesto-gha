const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { errorCatch } = require('../utils/helpers');

module.exports = (req, res, next) => {
  const { jwtToken } = req.cookies;
  if (!jwtToken) {
    errorCatch(new mongoose.Error.AuthorizationError(), res);
  }
  let payload;
  try {
    payload = jwt.verify(jwtToken, 'some-secret-key');
  } catch (error) {
    errorCatch(new mongoose.Error.AuthorizationError(), res);
  }
  req.user = payload;

  next();
};
