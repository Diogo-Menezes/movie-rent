const express = require('express');

const genresRouter = require('../routes/genresRouter');
const customerRouter = require('../routes/customersRouter');
const moviesRouter = require('../routes/moviesRouter');
const rentalsRouter = require('../routes/rentalsRouter');
const userRouter = require('../routes/userRouter');
const authRouter = require('../routes/auth');
const errorMiddleware = require('../middleware/errorMiddleware');

module.exports = function (app) {
  app.use(express.json());
  app.use('/api/genres', genresRouter);
  app.use('/api/customers', customerRouter);
  app.use('/api/movies', moviesRouter);
  app.use('/api/rentals', rentalsRouter);
  app.use('/api/users', userRouter);
  app.use('/api/auth', authRouter);
  app.use(errorMiddleware);
};
