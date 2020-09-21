require('./startup/config')();
require('express-async-errors');
const winston = require('winston');
const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());

require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/validation')();
require('./startup/prod')(app);

app.use(express.static('../documentation/bundle.js'));

app.get('*', (req, res) => {
  res.sendFile(
    path.resolve(__dirname, '..', 'documentation', 'index.html')
  );
});

module.exports = app;
