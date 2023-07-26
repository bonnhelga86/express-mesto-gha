const { celebrate, Joi } = require('celebrate');

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
    avatar: Joi.string().pattern(/^https?:\/\/(www.)?[a-z0-9-]{2,}.[a-z]{2,6}(S)*/),
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
    userId: Joi.string().required().hex().length(24),
  }),
}, {
  abortEarly: false,
  messages: {
    'string.empty': 'Не заполнено обязательное поле!',
    'string.length': 'Не валидный id!',
    'string.alphanum': 'Не валидный id!',
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
    avatar: Joi.string().required().pattern(/^https?:\/\/(www.)?[a-z0-9-]{2,}.[a-z]{2,6}(S)*/),
  }),
}, {
  abortEarly: false,
  messages: {
    'string.empty': 'Не заполнено обязательное поле!',
    'string.pattern.base': 'Пожалуйста введите корректную ссылку.',
  },
});

module.exports = {
  loginValidator,
  createUserValidator,
  userIdValidator,
  updateUserValidator,
  updateAvatarValidator,
};
