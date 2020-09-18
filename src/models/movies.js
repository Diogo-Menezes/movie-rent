const { func } = require('joi');
const mongoose = require('mongoose');
const Joi = require('joi');

const { genreSchema } = require('./genres');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
    trim: true,
    minlength: 5,
    maxlength: 255,
  },
  genre: { type: genreSchema, require: true },
  numberInStock: { type: Number, require: true, min: 0 },
  dailyRentalRate: { type: Number, require: true, min: 0 },
});

function validateMovie(movie) {
  const schema = Joi.object({
    title: Joi.string().min(5).required(),
    genreId: Joi.string().required(),
    numberInStock: Joi.number().min(0).required(),
    dailyRentalRate: Joi.number().min(0).required(),
  });

  return schema.validate(movie);
}

const Movie = mongoose.model('Movie', movieSchema);

module.exports = { Movie, validateMovie };
