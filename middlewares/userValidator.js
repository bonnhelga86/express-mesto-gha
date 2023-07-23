const validator = require('validator');
const { celebrate, Joi } = require('celebrate');
// const mongoose = require('mongoose');
const { ValidationError } = require('../errors/validation-error');

const loginValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}, {
  abortEarly: false,
  messages: {
    'string.empty': 'Не заполнено обязательное поле!',
    'string.email': 'Пожалуйста введите корректный email.',
  },
});

const createUserValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(new RegExp('^https?:\/\/(www\.)?[a-z0-9-]{2,}\.[a-z]{2,6}(\S)*')),
  }),
}, {
  abortEarly: false,
  messages: {
    'string.empty': 'Не заполнено обязательное поле!',
    'string.email': 'Пожалуйста введите корректный email.',
    'string.min': 'В поле {#label} должно быть больше 1 символа.',
    'string.max': 'В поле должно быть меньше 30 символов.',
    'string.pattern.base': 'Пожалуйста введите корректную ссылку.',
  },
});

const userIdValidator = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required(),
  }),
}, {
  abortEarly: false,
  messages: {
    'string.empty': 'Не заполнено обязательное поле!',
  },
});

const updateUserValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}, {
  abortEarly: false,
  messages: {
    'string.empty': 'Не заполнено обязательное поле!',
    'string.min': 'В поле {#label} должно быть больше 1 символа.',
    'string.max': 'В поле должно быть меньше 30 символов.',
  },
});

const updateAvatarValidator = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(new RegExp('^https?:\/\/(www\.)?[a-z0-9-]{2,}\.[a-z]{2,6}(\S)*')),
  }),
}, {
  abortEarly: false,
  messages: {
    'string.empty': 'Не заполнено обязательное поле!',
    'string.pattern.base': 'Пожалуйста введите корректную ссылку.',
  },
});

// const loginValidator = (req, res, next) => {
//   if (!validator.isEmail(req.body.email) || validator.isEmpty(req.body.password)) {
//     throw new ValidationError('Некорректно заполнено одно из полей');
//   }
//   next();
// };

// const createUserValidator = (req, res, next) => {
//   if (!validator.isEmail(req.body.email) || validator.isEmpty(req.body.password)) {
//     throw new ValidationError('Некорректно заполнено одно из полей');
//   }
//   if (req.body.name && !validator.isLength(req.body.name, { min: 2, max: 30 })) {
//     throw new ValidationError('Поле name должно содержать от 2 до 30 символов');
//   }
//   if (req.body.about && !validator.isLength(req.body.about, { min: 2, max: 30 })) {
//     throw new ValidationError('Поле about должно содержать от 2 до 30 символов');
//   }
//   next();
// };

// const userIdValidator = (req, res, next) => {
//   if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
//     throw new ValidationError('Некорректно заполнено id');
//   }
//   next();
// };

// const updateUserValidator = (req, res, next) => {
//   if (!req.body.name
//     || !req.body.about
//     || !validator.isLength(req.body.name, { min: 2, max: 30 })
//     || !validator.isLength(req.body.about, { min: 2, max: 30 })
//   ) {
//     throw new ValidationError('Поля должны содержать от 2 до 30 символов');
//   }
//   next();
// };

// const updateAvatarValidator = (req, res, next) => {
//   const regex = /^https?:\/\/(www\.)?[a-z0-9-]{2,}\.(\S)*/gm;
//   const matched = regex.test(req.body.avatar);
//   if (!matched) {
//     throw new ValidationError('Некорректно заполнено поле avatar');
//   }
//   next();
// };

module.exports = {
  loginValidator,
  createUserValidator,
  userIdValidator,
  updateUserValidator,
  updateAvatarValidator,
};
