require('./startup/config')();
require('express-async-errors');
const winston = require('winston');
const express = require('express');

const app = express();
require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/validation')();

const port = process.env.PORT || 3333;

app.listen(port, () => winston.info(`Server started in port: ${port} 🚀`));
