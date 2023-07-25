// const validator = require('validator');
const { celebrate, Joi } = require('celebrate');

const createCardValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(new RegExp('^https?:\/\/(www\.)?[a-z0-9-]{2,}\.[a-z]{2,6}(\S)*')),
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
    cardId: Joi.string().required().alphanum().length(24),
  }),
}, {
  abortEarly: false,
  messages: {
    'string.empty': 'Не заполнено обязательное поле!',
    'string.length': 'Не валидный id!',
    'string.alphanum': 'Не валидный id!',
  },
});

// const createCardValidator = (req, res, next) => {
//   const regex = /^https?:\/\/(www\.)?[a-z0-9-]{2,}\.(\S)*/gm;
//   if (!req.body.name
//     || !req.body.link
//     || !validator.isLength(req.body.name, { min: 2, max: 30 })
//     || !regex.test(req.body.link)
//   ) {
//     throw new ValidationError('Некорректно заполнено одно из полей');
//   }
//   next();
// };

// const cardIdValidator = (req, res, next) => {
//   if (!mongoose.Types.ObjectId.isValid(req.params.cardId)) {
//     throw new ValidationError('Некорректно заполнено id');
//   }
//   next();
// };

module.exports = {
  createCardValidator,
  cardIdValidator,
};
