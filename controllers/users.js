const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { NotFoundError } = require('../errors/not-found-error');
const { DuplicateError } = require('../errors/duplicate-error');
const { AuthorizationError } = require('../errors/authorization-error');
const { ValidationError } = require('../errors/validation-error');

module.exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.send({ data: users });
  } catch (error) {
    next(error);
  }
};

module.exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user);
    res.send({ data: user });
  } catch (error) {
    next(error);
  }
};

module.exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) throw new NotFoundError('Пользователь не найден');
    res.send({ data: user });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      next(new ValidationError('Не валидный id!'));
    } else {
      next(error);
    }
  }
};

module.exports.createUser = async (req, res, next) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({
      email: req.body.email,
      password: hash,
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
    });
    res.send({
      data: {
        email: user.email,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      next(new ValidationError('Некорректно заполнено одно из полей'));
    } else if (error.code === 11000) {
      next(new DuplicateError('Пользователь с таким email уже существует'));
    } else {
      next(error);
    }
  }
};

module.exports.updateUser = async (req, res, next) => {
  const { name, about } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    );
    res.send({ data: user });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      next(new ValidationError('Некорректно заполнено одно из полей'));
    } else {
      next(error);
    }
  }
};

module.exports.updateAvatar = async (req, res, next) => {
  const { avatar } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    );
    res.send({ data: user });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      next(new ValidationError('Некорректно заполнено одно из полей'));
    } else {
      next(error);
    }
  }
};

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new AuthorizationError('Неверные имя пользователя или пароль');
    }
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) throw new AuthorizationError('Неверные имя пользователя или пароль');

    const token = jwt.sign({ _id: user._id }, 'user-secret-key', { expiresIn: '7d' });
    res.cookie('jwtToken', token, {
      maxAge: 3600000 * 24 * 7,
      httpOnly: true,
    }).send({ data: { email: user.email } });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      next(new ValidationError('Некорректно заполнено одно из полей'));
    } else {
      next(error);
    }
  }
};

module.exports.logout = async (req, res) => {
  res.clearCookie('jwtToken').send({ message: 'Вы вышли из аккаунта' });
};
