const mongoose = require('mongoose');
const Joi = require('joi');

const genreSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 5, maxlength: 50 },
});

const Genre = mongoose.model('genre', genreSchema);

const validateGenre = genre => {
  const schema = Joi.object({ name: Joi.string().min(3).required() });

  return schema.validate(genre);
};

module.exports = { Genre, validateGenre, genreSchema };
