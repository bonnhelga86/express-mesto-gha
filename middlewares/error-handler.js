const mongoose = require('mongoose');


const errorHandler = (err, req, res, next) => {
  if (err instanceof mongoose.Error.CastError) {
    res.status(400).send({ message: 'Не корректно заполнено поле id' });
    next();
}
  const { statusCode = 500, message = 'На сервере произошла ошибка' } = err;
  res.status(statusCode).send({ message });
  next();
};

module.exports = { errorHandler };
