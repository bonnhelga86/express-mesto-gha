const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  errorCatch,
  errorsCode,
  getResponseData,
  authorizationError,
} = require('../utils/helpers');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(errorsCode.invalidServer.key)
      .send({ message: errorsCode.invalidServer.message }));
};

module.exports.getCurrentUser = (req, res) => {
  getResponseData.call(User.findById(req.user).orFail(), res);
};

module.exports.getUser = (req, res) => {
  getResponseData.call(User.findById(req.params.userId).orFail(), res);
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
    .orFail(() => {
      authorizationError();
    })
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
