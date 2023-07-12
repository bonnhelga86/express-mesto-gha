const mongoose = require('mongoose');

const errorsCode = {
  400: 'Некорректно заполнено одно из полей',
  404: 'Запрашиваемый объект не найден',
  500: 'На сервере произошла ошибка',
};

module.exports.errorCatch = (error, res) => {
  if (error.path === '_id' && !mongoose.Types.ObjectId.isValid(error.value)) {
    return res.status(400).send({ message: errorsCode[res.status] });
  }
  if (error.name === 'ValidationError') {
    return res.status(400).send({ message: errorsCode[res.status] });
  }
  if (error.name === 'CastError') {
    return res.status(404).send({ message: errorsCode[res.status] });
  }
  return res.status(500).send({ message: errorsCode[res.status] });
};

module.exports.getResponseData = (data, res) => {
  if (!data) {
    const err = new Error();
    err.name = 'CastError';
    throw err;
  }
  res.send({ data });
};
