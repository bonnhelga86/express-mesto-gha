const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { NotFoundError } = require('../errors/not-found-error');
const { ValidationError } = require('../errors/validation-error');
const { DuplicateError } = require('../errors/duplicate-error');
const { AuthorizationError } = require('../errors/authorization-error');

module.exports.getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({});
  } catch (error) {
    next(error);
    return;
  }
  res.send({ data: users });
};

module.exports.getCurrentUser = async (req, res, next) => {
  let user;
  try {
    user = await User.findById(req.user);
  } catch (error) {
    next(error);
    return;
  }
  res.send({ data: user });
};

module.exports.getUser = async (req, res, next) => {
  let user;
  try {
    user = await User.findById(req.params.userId);
    if (!user) throw new NotFoundError('Пользователь не найден');
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      next(new ValidationError('Некорректно заполнено одно из полей'));
      return;
    }
    next(error);
    return;
  }
  res.send({ data: user });
};

module.exports.createUser = async (req, res, next) => {
  let user;
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    user = await User.create({
      email: req.body.email,
      password: hash,
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
    });
  } catch (error) {
    if (error.code === 11000) {
      next(new DuplicateError('Пользователь с таким email уже существует'));
      return;
    }
    next(error);
    return;
  }
  res.send({ data: user });
};

module.exports.updateUser = async (req, res, next) => {
  const { name, about } = req.body;
  let user;
  try {
    user = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    );
  } catch (error) {
    next(error);
    return;
  }
  res.send({ data: user });
};

module.exports.updateAvatar = async (req, res, next) => {
  const { avatar } = req.body;
  let user;
  try {
    user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    );
  } catch (error) {
    next(error);
    return;
  }
  res.send({ data: user });
};

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  let user;
  try {
    user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new AuthorizationError('Неверные имя пользователя или пароль');
    }
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) throw new AuthorizationError('Неверные имя пользователя или пароль');
  } catch (error) {
    next(error);
    return;
  }
  const token = jwt.sign({ _id: user._id }, 'user-secret-key', { expiresIn: '7d' });
  res.cookie('jwtToken', token, {
    maxAge: 3600000 * 24 * 7,
    httpOnly: true,
  }).end();
};
