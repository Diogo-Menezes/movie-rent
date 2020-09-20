const { Router } = require('express');

const requireAuth = require('../middleware/requireAuth');
const admin = require('../middleware/admin');

const { Genre, validateGenre } = require('../models/genres');
const mongoose = require('mongoose');
const validateObjectId = require('../middleware/validateObjectId');

const genresRouter = Router();

genresRouter.get('/', async (req, res) => {
  const genres = await Genre.find().sort('name');

  res.send(genres);
});
genresRouter.get('/:id', validateObjectId, async (req, res) => {
  const genre = await Genre.findById(req.params.id);

  if (!genre) return res.status(404).send('Invalid genre id provided');

  res.send(genre);
});
genresRouter.post('/', requireAuth, async (req, res) => {
  const { error } = validateGenre(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  const genre = await new Genre({ name: req.body.name }).save();

  res.send(genre);
});

genresRouter.put('/:id', requireAuth, async (req, res) => {
  const { error } = validateGenre(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
    },
    { useFindAndModify: true, new: true }
  );

  if (!genre) return res.status(404).send('Invalid genre id provided');

  res.send(genre);
});
genresRouter.delete('/:id', [requireAuth, admin], async (req, res) => {
  const genre = await Genre.findByIdAndDelete(req.params.id);

  if (!genre) return res.status(404).send('Invalid genre id provided');

  res.send(genre);
});

module.exports = genresRouter;
