const mongoose = require('mongoose');
const Joi = require('joi');

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, minlength: 9 },
  isGold: { type: Boolean, default: false },
});

const Customer = mongoose.model('Customer', customerSchema);

const validateCustomer = customer => {
  const customerSchema = Joi.object({
    isGold: Joi.boolean(),
    name: Joi.string().required(),
    phone: Joi.string().required().min(9),
  });

  return customerSchema.validate(customer);
};

module.exports = { Customer, validateCustomer };
