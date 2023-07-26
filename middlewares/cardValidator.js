const { celebrate, Joi } = require('celebrate');

const createCardValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(/^https?:\/\/(www.)?[a-z0-9-]{2,}.[a-z]{2,6}(S)*/),
  }),
}, {
  abortEarly: false,
  messages: {
    'string.empty': 'Не заполнено обязательное поле!',
    'string.min': 'В поле {#label} должно быть больше 1 символа.',
    'string.max': 'В поле должно быть меньше 30 символов.',
    'string.pattern.base': 'Пожалуйста введите корректную ссылку.',
  },
});

const cardIdValidator = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
}, {
  abortEarly: false,
  messages: {
    'string.empty': 'Не заполнено обязательное поле!',
    'string.length': 'Не валидный id!',
    'string.alphanum': 'Не валидный id!',
  },
});

module.exports = {
  createCardValidator,
  cardIdValidator,
};
