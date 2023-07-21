const Card = require('../models/card');
const { NotFoundError } = require('../errors/not-found-error');
const { AuthorizationError } = require('../errors/authorization-error');

module.exports.getCards = async (req, res, next) => {
  let cards;
  try {
    cards = await Card.find({}).populate('owner');
  } catch (error) {
    next(error);
    return;
  }
  res.send({ data: cards });
};

module.exports.createCard = async (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user;
  let card;
  try {
    card = await Card.create({ name, link, owner });
  } catch (error) {
    next(error);
    return;
  }
  res.send({ data: card });
};

module.exports.deleteCard = async (req, res, next) => {
  let card;
  try {
    card = await Card.findById(req.params.cardId).populate('owner');
    if (!card) throw new NotFoundError('Карточка не найдена');
    if (!card.owner._id.equals(req.user._id)) throw new AuthorizationError('Вы можете удалять только свои карточки');
    await Card.findByIdAndRemove(req.params.cardId);
  } catch (error) {
    next(error);
    return;
  }
  res.send({ data: card });
};

module.exports.likeCard = async (req, res, next) => {
  let card;
  try {
    card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    ).populate('owner');
    if (!card) throw new NotFoundError('Карточка не найдена');
  } catch (error) {
    next(error);
    return;
  }
  res.send({ data: card });
};

module.exports.dislikeCard = async (req, res, next) => {
  let card;
  try {
    card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    ).populate('owner');
    if (!card) throw new NotFoundError('Карточка не найдена');
  } catch (error) {
    next(error);
    return;
  }
  res.send({ data: card });
};
