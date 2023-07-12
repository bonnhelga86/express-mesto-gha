const Card = require('../models/card');
const { errorCatch, getResponseData } = require('../utils/helpers');

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((error) => errorCatch(error, res));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .populate('owner')
    .then((card) => getResponseData(card, res))
    .catch((error) => errorCatch(error, res));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .populate('owner')
    .then((card) => getResponseData(card, res))
    .catch((error) => errorCatch(error, res));
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .populate('owner')
    .then((card) => getResponseData(card, res))
    .catch((error) => errorCatch(error, res));
};
