const { Router } = require('express');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const requireAuth = require('../middleware/requireAuth');

const { User, validateUser } = require('../models/user');

const userRouter = Router();

userRouter.get('/me', requireAuth, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password -__v');

  res.send(user);
});

userRouter.post('/', async (req, res) => {
  const { error } = validateUser(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  const userExists = await User.findOne({ email: req.body.email });

  if (userExists) return res.status(400).send('User is already registered');

  const user = new User(_.pick(req.body, ['name', 'email', 'password']));

  const salt = await bcrypt.genSalt(10);

  user.password = await bcrypt.hash(user.password, salt);

  user.save();

  return res
    .header('x-auth-token', user.generateAuthToken())
    .send(_.omit(user, ['__v', 'password']));
});

module.exports = userRouter;
