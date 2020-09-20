const mongoose = require('mongoose');
const winston = require('winston');

module.exports = function () {
  const uri =
    process.env.NODE_ENV === 'test'
      ? process.env.MONGO_URI_TEST
      : process.env.MONGO_URI;

  mongoose
    .connect(uri, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    })
    .then(v => winston.info('Connected to mongoDB: ' + uri));
};
