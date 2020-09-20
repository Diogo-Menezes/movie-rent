const { Router } = require('express');
const Joi = require('joi');
const requireAuth = require('../middleware/requireAuth');
const { Rental } = require('../models/rental');

const { Movie } = require('../models/movie');
const returnsRouter = Router();

returnsRouter.post('/', requireAuth, async (req, res) => {
  const { error } = validateReturn(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  // const rental = await Rental.findOne({
  //   'customer._id': req.body.customerId,
  //   'movie._id': req.body.movieId,
  // });

  const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

  if (!rental) return res.status(404).send('No rental found');

  if (rental.returnDate)
    return res.status(400).send('Return already processed');

  /*   rental.returnDate = new Date();

  const diff = differenceInDays(rental.returnDate, rental.rentDate);

  rental.rentalFee = diff * rental.movie.dailyRentalRate;

  await rental.save(); */

  rental.processReturn();
  await rental.save();

  const movie = await Movie.findByIdAndUpdate(req.body.movieId, {
    $inc: { numberInStock: 1 },
  });

  movie.save();

  res.send(rental);
});

function validateReturn(rental) {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  });

  return schema.validate(rental);
}

module.exports = returnsRouter;
