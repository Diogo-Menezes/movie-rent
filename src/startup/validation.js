const Joi = require('joi');
const { func } = require('joi');

module.exports = function () {
  Joi.objectId = require('joi-objectid')(Joi);
};
