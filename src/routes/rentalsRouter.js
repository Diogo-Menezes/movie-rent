const { Router } = require('express');
const { Rental, validateRental } = require('../models/rental');
const { Movie } = require('../models/movie');
const { Customer } = require('../models/customer');
const requireAuth = require('../middleware/requireAuth');
const mongoose = require('mongoose');
const rentalsRouter = Router();
const Fawn = require('fawn');

Fawn.init(mongoose);

rentalsRouter.get('/', async (req, res) => {
  const rentals = await Rental.find().sort('-rentDate');
  res.json({ rentals });
});

rentalsRouter.get('/:id', async (req, res) => {
  const rental = await Rental.findById(req.params.id);

  if (!rental)
    return res.status(404).json({ error: 'No rental found for the given id' });

  res.json({ rental });
});

rentalsRouter.post('/', requireAuth, async (req, res) => {
  const { error } = validateRental(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId).select(
    'name phone'
  );

  if (!customer) return res.status(404).send('Invalid customer id');

  const movie = await Movie.findById(req.body.movieId).select(
    'title dailyRentalRate numberInStock'
  );

  if (!movie) return res.status(404).send('Invalid movie id');

  if (movie.numberInStock < 1) {
    return res.status(400).send('Movie not in stock');
  }

  /*   const session = await mongoose.startSession();
  session.startTransaction();

  const rental = Rental.create(
    {
      customer: { ...customer },
      movie: { ...movie },
    },
    { session: session }
  );
  movie.update({ $inc: { numberInStock: -1 } }).session(session);

  try {
    await rental.save();
    movie.numberInStock -= 1;
    await movie.save();
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
  } finally {
    session.endSession();
  } */

  const rental = new Rental({
    customer: { ...customer },
    movie: { ...movie },
  });

  try {
    await new Fawn.Task()
      .save('rentals', rental)
      .update('movies', { _id: movie._id }, { $inc: { numberInStock: -1 } })
      .run();

    res.json({ rental });
  } catch (error) {
    return res.status(500).send('Something went wrong');
  }
});

module.exports = rentalsRouter;
