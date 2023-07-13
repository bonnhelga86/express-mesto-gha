const mongoose = require('mongoose');

const errorsCode = {
  invalidField: { key: 400, message: 'Некорректно заполнено одно из полей' },
  invalidObject: { key: 404, message: 'Запрашиваемый объект не найден' },
  invalidServer: { key: 500, message: 'На сервере произошла ошибка' },
};

module.exports.errorCatch = (error, res) => {
  if (error instanceof mongoose.Error.ValidationError
    || error instanceof mongoose.Error.CastError) {
    return res.status(errorsCode.invalidField.key)
      .send({ message: errorsCode.invalidField.message });
  }
  if (error instanceof mongoose.Error.DocumentNotFoundError) {
    return res.status(errorsCode.invalidObject.key)
      .send({ message: errorsCode.invalidObject.message });
  }
  return res.status(errorsCode.invalidServer.key)
    .send({ message: errorsCode.invalidServer.message });
};

module.exports.errorsCode = errorsCode;
