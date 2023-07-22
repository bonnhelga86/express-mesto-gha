const validator = require('validator');
const { ValidationError } = require('../errors/validation-error');

const loginValidator = (req, res, next) => {
  if (!validator.isEmail(req.body.email) || validator.isEmpty(req.body.password)) {
    throw new ValidationError('Некорректно заполнено одно из полей');
  }
  next();
};

const updateUserValidator = (req, res, next) => {
  if (!req.body.name
    || !req.body.about
    || !validator.isLength(req.body.name, { min: 2, max: 30 })
    || !validator.isLength(req.body.about, { min: 2, max: 30 })
  ) {
    throw new ValidationError('Поля должны содержать от 2 до 30 символов');
  }
  next();
};

const createUserValidator = (req, res, next) => {
  if (!validator.isEmail(req.body.email) || validator.isEmpty(req.body.password)) {
    throw new ValidationError('Некорректно заполнено одно из полей');
  }
  if (req.body.name && !validator.isLength(req.body.name, { min: 2, max: 30 })) {
    throw new ValidationError('Поле name должно содержать от 2 до 30 символов');
  }
  if (req.body.about && !validator.isLength(req.body.about, { min: 2, max: 30 })) {
    throw new ValidationError('Поле about должно содержать от 2 до 30 символов');
  }
  next();
};

module.exports = {
  loginValidator,
  createUserValidator,
  updateUserValidator,
};
