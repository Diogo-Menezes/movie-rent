const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const userSchema = new mongoose.Schema({
  name: { type: String, minlength: 5, maxlength: 50, required: true },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    match: emailRegex,
  },
  password: { type: String, required: true, minlength: 8 },
  isAdmin: { type: Boolean, default: false },
});

userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    process.env.JWT_KEY
  );
};

const User = mongoose.model('User', userSchema);

const validateUser = user => {
  const schema = Joi.object({
    name: Joi.string().min(5).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  });

  return schema.validate(user);
};

module.exports = { User, validateUser };
