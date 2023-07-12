const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { errorCatch } = require('./utils/helpers');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: '64ae4ee5fa175685bc309d9b',
  };

  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('*', (req, res) => {
  const err = new Error();
  err.name = 'CastError';
  errorCatch(err, res);
});

app.listen(PORT);
