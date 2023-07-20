// const ValidationError = require('../errors/validation-error');
// const AuthorizationError = require('../errors/authorization-error');
// const NotFoundError = require('../errors/not-found-error');
// const RegistrationError = require('../errors/registration-error');
// const ServerError = require('../errors/server-error');

const errorHandler = (err, req, res, next) => {
  console.log('HERE!!!');
  // res.send({ data: err });
  next();
  const { statusCode = 500, message = 'На сервере произошла ошибка' } = err;
  res.status(statusCode).send({ message });
};

module.exports = { errorHandler };
