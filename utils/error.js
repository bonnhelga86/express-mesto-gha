module.exports.errorCatch = (error, res) => {
  if (error.name === 'CastError') {
    return res.status(404).send({ message: 'Запрашиваемый объект не найден' });
  }
  if (error.name === 'ValidationError') {
    return res.status(400).send({ message: 'Некорректно заполнено одно из полей' });
  }
  return res.status(500).send({ message: 'Произошла ошибка' });
};
