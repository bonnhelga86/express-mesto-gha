const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const { errorHandler } = require('./middlewares/error-handler');

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(cookieParser());

app.use('', require('./routes/index'));

app.use(errorHandler);

app.listen(PORT);
