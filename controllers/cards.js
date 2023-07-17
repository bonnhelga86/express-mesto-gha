const Card = require('../models/card');
const { errorsCode, getResponseData } = require('../utils/helpers');

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(errorsCode.invalidServer.key)
      .send({ message: errorsCode.invalidServer.message }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  getResponseData.call(Card.create({ name, link, owner }), res);
};

module.exports.deleteCard = (req, res) => {
  getResponseData.call(Card.findByIdAndRemove(req.params.cardId).orFail()
    .populate('owner'), res);
};

module.exports.likeCard = (req, res) => {
  getResponseData
    .call(
      Card
        .findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
        .orFail()
        .populate('owner'),
      res,
    );
};

module.exports.dislikeCard = (req, res) => {
  getResponseData
    .call(
      Card
        .findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
        .orFail()
        .populate('owner'),
      res,
    );
};
