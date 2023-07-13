const User = require('../models/user');
const { errorsCode, normalizeAnswer } = require('../utils/helpers');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(errorsCode.invalidServer.key)
      .send({ message: errorsCode.invalidServer.message }));
};

module.exports.getUser = (req, res) => {
  normalizeAnswer.call(User.findById(req.params.userId).orFail(), res);
};

module.exports.createUser = (req, res) => {
  normalizeAnswer.call(User.create(req.body), res);
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;

  normalizeAnswer
    .call(User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    ), res);
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  normalizeAnswer
    .call(User.findByIdAndUpdate(req.user._id, { avatar }, { new: true }), res);
};
