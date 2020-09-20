const helmet = require('helmet');

const compression = require('compression');

module.exports = app => {
  if (process.env.NODE_ENV === 'production') {
    // app.use(helmet());
    // app.use(compression());
  }
};
