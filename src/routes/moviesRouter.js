const { Router } = require('express');
const requireAuth = require('../middleware/requireAuth');

const { Genre } = require('../models/genres');
const { Movie, validateMovie } = require('../models/movie');

const moviesRouter = Router();

moviesRouter.get('/', async (req, res) => {
  const movies = await Movie.find().sort('title');

  res.send(movies);
});
moviesRouter.get('/:id', async (req, res) => {
  const movie = await Movie.findById(req.params.id);

  if (!movie) return res.status(404).send('Invalid movie id');

  res.send(movie);
});

moviesRouter.post('/', requireAuth, async (req, res) => {
  const { error } = validateMovie(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);

  if (!genre) return res.status(404).send('Invalid genre id provided');

  const movie = new Movie({
    ...req.body,
    genre: { _id: genre._id, name: genre.name },
  });

  res.send(movie);
});

moviesRouter.put('/:id', requireAuth, async (req, res) => {
  const { error } = validateMovie(req.body);

  if (error) return res.status(400).send(error.message[0].details);

  const movie = await Movie.findOneAndUpdate(req.params.id, { ...req.body });

  if (!movie) return res.status(404).send('Invalid movie id');

  res.send(movie);
});

moviesRouter.delete('/:id',requireAuth, async (req, res) => {
  const movie = await Movie.findByIdAndRemove(req.params.id);

  if (!movie) return res.status(404).send('Invalid movie id');

  res.send(movie);
});

module.exports = moviesRouter;
