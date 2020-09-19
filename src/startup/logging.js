const winston = require('winston');
require('winston-mongodb');

module.exports = function () {
  process.on('unhandledRejection', ex => {
    throw ex;
  });

  if (process.env.NODE_ENV !== 'production') {
    winston.add(
      new winston.transports.Console({
        format: winston.format.simple(),
        colorize: true,
        prettyPrint: true,
      })
    );
  }

  winston.add(
    new winston.transports.File({
      filename: './logs/info.log',
      level: 'info',
    })
  );

  winston.exceptions.handle(
    new winston.transports.Console(),
    new winston.transports.File({ filename: './logs/exceptions.log' })
  );

  /*   winston.add(
    new winston.transports.MongoDB({
      db: process.env.MONGO_URI,
      level: 'error',
    })
  ); */
};
