module.exports = function () {
  if (process.env.NODE_ENV !== 'production') require('dotenv').config();

  if (process.env.JWT_KEY === undefined) {
    throw new Error('JWT KEY needs to be defined');
  }
};
