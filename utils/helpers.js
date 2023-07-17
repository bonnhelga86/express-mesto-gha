const mongoose = require('mongoose');

const errorsCode = {
  invalidField: { key: 400, message: 'Некорректно заполнено одно из полей' },
  invalidAuth: { key: 401, message: 'Неправильные почта или пароль' },
  invalidObject: { key: 404, message: 'Запрашиваемый объект не найден' },
  invalidServer: { key: 500, message: 'На сервере произошла ошибка' },
};

const errorCatch = (error, res) => {
  if (error instanceof mongoose.Error.ValidationError
    || error instanceof mongoose.Error.CastError) {
    return res.status(errorsCode.invalidField.key)
      .send({ message: errorsCode.invalidField.message });
  }
  if (error instanceof mongoose.Error.AuthorizationError) {
    return res.status(errorsCode.invalidAuth.key)
      .send({ message: errorsCode.invalidAuth.message });
  }
  if (error instanceof mongoose.Error.DocumentNotFoundError) {
    return res.status(errorsCode.invalidObject.key)
      .send({ message: errorsCode.invalidObject.message });
  }
  return res.status(errorsCode.invalidServer.key)
    .send({ message: errorsCode.invalidServer.message });
};

function getResponseData(res) {
  this.then((data) => res.send({ data }))
    .catch((error) => errorCatch(error, res));
}

module.exports = {
  errorsCode,
  errorCatch,
  getResponseData,
};
