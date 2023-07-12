const Card = require('../models/card');

const errorCatch = (error, res) => {
  if (error.name === 'CastError') {
    return res.status(404).send({ message: 'Запрашиваемый объект не найден' });
  }
  if (error.name === 'ValidationError') {
    return res.status(400).send({ message: 'Некорректно заполнено одно из полей' });
  }
  return res.status(500).send({ message: 'Произошла ошибка' });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const userId = req.user._id;

  Card.create({ name, link, userId })
    .then((card) => res.send({ data: card }))
    .catch((error) => errorCatch(error, res));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => res.send({ data: card }))
    .catch((error) => errorCatch(error, res));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => res.send({ data: card }))
    .catch((error) => errorCatch(error, res));
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => res.send({ data: card }))
    .catch((error) => errorCatch(error, res));
};
