require('./startup/config')();
require('express-async-errors');
const winston = require('winston');
const express = require('express');

const app = express();
app.use(express.json());
require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/validation')();
require('./startup/prod')(app);

module.exports = app;
