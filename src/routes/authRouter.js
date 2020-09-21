const { Router } = require('express');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const { User } = require('../models/user');
const authRouter = Router();
const _ = require('lodash');

authRouter.post('/', async (req, res) => {
  const { error } = validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({ email: req.body.email });

  if (!user) return res.status(400).send('Invalid email or password');

  const passwordMatch = await bcrypt.compare(req.body.password, user.password);

  if (!passwordMatch) return res.status(400).send('Invalid email or password');

  const token = user.generateAuthToken();

  return res
    .header('x-auth-token', token)
    .send(_.omit(user.toJSON(), ['__v', 'password']));
});

const validate = user => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  });

  return schema.validate(user);
};

module.exports = authRouter;
