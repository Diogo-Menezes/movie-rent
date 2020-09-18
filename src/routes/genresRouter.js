const { Router } = require('express');

const Genre = require('../models/genres');

const genresRouter = Router();

genresRouter.get('/', async (req, res) => {
  const genres = await genres.find().sort('name');

  res.send(genres);
});
genresRouter.get('/:id', async (req, res) => {
  const genre = await Genre.findById(req.params.id);

  if (!genre) return res.status(404).send('Invalid genre id provided');

  res.send(genre);
});
genresRouter.post('/', async (req, res) => {
  const { error } = validateGenre(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  const genre = await new Genre({ name: req.body.name }).save();

  res.send(genre);
});

genresRouter.put('/:id', async (req, res) => {
  const { error } = validateGenre(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
    },
    { new: true }
  );

  if (!genre) return res.status(404).send('Invalid genre id provided');

  res.send(genre);
});
genresRouter.delete('/:id', async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);

  if (!genre) return res.status(404).send('Invalid genre id provided');

  res.send(genre);
});

module.exports = genresRouter;
