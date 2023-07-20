const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { NotFoundError } = require('../errors/not-found-error');
const { ValidationError } = require('../errors/validation-error');

const {
  errorCatch,
  getResponseData,
  authorizationError,
} = require('../utils/helpers');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user)
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден');
    })
    .then((data) => {
      res.send({ data });
    })
    .catch((next));
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден');
    })
    .then((data) => res.send({ data }))
    .catch((error) => {
      if (error instanceof mongoose.Error.CastError) {
        next(new ValidationError('Некорректно заполнено одно из полей'));
        return;
      }
      next({ data: error });
    });
};

module.exports.createUser = (req, res) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      getResponseData.call(User.create({
        email: req.body.email,
        password: hash,
        name: req.body.name,
        about: req.body.about,
        avatar: req.body.avatar,
      }), res);
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;

  getResponseData
    .call(User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    ), res);
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  getResponseData
    .call(User.findByIdAndUpdate(req.user._id, { avatar }, { new: true }), res);
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .orFail(authorizationError)
    .then((user) => {
      if (!user) {
        authorizationError();
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            authorizationError();
          }
          return user;
        });
    })
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'user-secret-key', { expiresIn: '7d' });
      return res.cookie('jwtToken', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      }).end();
    })
    .catch((error) => {
      errorCatch(error, res);
    });
};
