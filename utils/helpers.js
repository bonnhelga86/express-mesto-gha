const mongoose = require('mongoose');

const errorsCode = {
  invalidField: { key: 400, message: 'Некорректно заполнено одно из полей' },
  invalidObject: { key: 404, message: 'Запрашиваемый объект не найден' },
  invalidServer: { key: 500, message: 'На сервере произошла ошибка' },
};

module.exports.errorCatch = (error, res) => {
  if (error.path === '_id' && !mongoose.Types.ObjectId.isValid(error.value)) {
    return res.status(errorsCode.invalidField.key)
      .send({ message: errorsCode.invalidField.message });
  }
  if (error.name === 'ValidationError') {
    return res.status(errorsCode.invalidField.key)
      .send({ message: errorsCode.invalidField.message });
  }
  if (error.name === 'CastError') {
    return res.status(errorsCode.invalidObject.key)
      .send({ message: errorsCode.invalidObject.message });
  }
  return res.status(errorsCode.invalidServer.key)
    .send({ message: errorsCode.invalidServer.message });
};

module.exports.getResponseData = (data, res) => {
  if (!data) {
    const err = new Error();
    err.name = 'CastError';
    throw err;
  }
  res.send({ data });
};
