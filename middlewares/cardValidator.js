const validator = require('validator');
const mongoose = require('mongoose');
const { ValidationError } = require('../errors/validation-error');

const createCardValidator = (req, res, next) => {
  const regex = /^https?:\/\/(www\.)?[a-z0-9-]{2,}\.(\S)*/gm;
  if (!req.body.name
    || !req.body.link
    || !validator.isLength(req.body.name, { min: 2, max: 30 })
    || !regex.test(req.body.link)
  ) {
    throw new ValidationError('Некорректно заполнено одно из полей');
  }
  next();
};

const cardIdValidator = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.cardId)) {
    throw new ValidationError('Некорректно заполнено id');
  }
  next();
};

module.exports = {
  createCardValidator,
  cardIdValidator,
};
