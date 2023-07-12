const mongoose = require('mongoose');

module.exports.errorCatch = (error, res) => {
  if (error.path === '_id' && !mongoose.Types.ObjectId.isValid(error.value)) {
    return res.status(400).send({ message: 'Некорректное значение id' });
  }
  if (error.name === 'ValidationError') {
    return res.status(400).send({ message: 'Некорректно заполнено одно из полей' });
  }
  if (error.name === 'CastError') {
    return res.status(404).send({ message: 'Запрашиваемый объект не найден' });
  }
  return res.status(500).send({ message: 'Произошла ошибка' });
};
