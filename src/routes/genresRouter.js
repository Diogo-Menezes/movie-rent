const { Router } = require('express');
const Joi = require('joi');

const genresRouter = Router();

const genres = [
  { id: 1, name: 'Sci-fi' },
  { id: 2, name: 'Terror' },
  { id: 3, name: 'Action' },
  { id: 4, name: 'Romance' },
  { id: 5, name: 'Comedy' },
];

genresRouter.get('/', (req, res) => {
  res.send(genres);
});
genresRouter.get('/:id', (req, res) => {
  const genre = genres.find(genre => genre.id === Number(req.params.id));

  if (!genre) return res.status(404).send('Invalid genre id provided');

  res.send(genre);
});
genresRouter.post('/', (req, res) => {
  const { error } = validateGenre(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  const genre = { id: genres.length + 1, name: req.body.name };

  genres.push(genre);

  res.send(genre);
});

genresRouter.put('/:id', (req, res) => {
  const genre = genres.find(genre => genre.id === Number(req.params.id));

  if (!genre) return res.status(404).send('Invalid genre id provided');

  const { error } = validateGenre(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  genre.name = req.body.name;

  res.send(genre);
});
genresRouter.delete('/:id', (req, res) => {
  const genre = genres.find(genre => genre.id === Number(req.params.id));

  if (!genre) return res.status(404).send('Invalid genre id provided');

  const index = genres.indexOf(genre);

  genres.splice(index, 1);

  res.send(genre);
});

const validateGenre = genre => {
  const schema = Joi.object({ name: Joi.string().min(3).required() });

  return schema.validate(genre);
};

module.exports = genresRouter;
