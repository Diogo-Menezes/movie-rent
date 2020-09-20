const app = require('../../../index');
const request = require('supertest');
const mongoose = require('mongoose');
const { addDays } = require('date-fns');

const { Rental } = require('../../../models/rental');
const { User } = require('../../../models/user');
const { Movie } = require('../../../models/movie');
const { Genre } = require('../../../models/genres');

describe('/api/returns', () => {
  describe('POST /', () => {
    let rental;
    let movieId;
    let customerId;
    let token;
    let movie;

    beforeEach(async () => {
      token = new User().generateAuthToken();
      customerId = mongoose.Types.ObjectId();
      movieId = mongoose.Types.ObjectId();

      movie = new Movie({
        _id: movieId,
        title: 'fake-title',
        genre: { name: 'genre1' },
        numberInStock: 9,
        dailyRentalRate: 3,
      });

      await movie.save();

      rental = new Rental({
        customer: { _id: customerId, name: 'John Doe', phone: '123456789' },
        movie: {
          _id: movieId,
          title: movie.title,
          dailyRentalRate: movie.dailyRentalRate,
        },
      });

      await rental.save();
    });
    afterEach(async () => {
      await Rental.deleteMany({});
      await Movie.deleteMany({});
    });

    const callApi = () =>
      request(app)
        .post('/api/returns')
        .send({ customerId, movieId })
        .set('x-auth-token', token);

    it('should return 401 if not authenticated', async () => {
      token = '';
      const response = await callApi();

      expect(response.status).toBe(401);
    });

    it('should return 400 if customerId is not valid', async () => {
      customerId = '';
      const response = await callApi();
      expect(response.status).toBe(400);
    });

    it('should return 400 if movieId is not valid', async () => {
      movieId = '';
      const response = await callApi();
      expect(response.status).toBe(400);
    });

    it('should return 404 if no rental is found', async () => {
      await Rental.deleteMany({});

      const response = await callApi();

      expect(response.status).toBe(404);
    });

    it('should return 400 if return was already processed', async () => {
      await Rental.findByIdAndUpdate(rental._id, {
        $set: { returnDate: new Date() },
      });

      const response = await callApi();

      expect(response.status).toBe(400);
    });

    it('should return 200 if return was successful', async () => {
      const response = await callApi();
      expect(response.status).toBe(200);
    });

    it('should set the rental with the returning date', async () => {
      await callApi();
      const storedRental = await Rental.findById(rental._id);
      const diff = new Date() - storedRental.returnDate;
      expect(diff).toBeLessThan(10 * 1000);
    });

    it('should calculate the rental fee and update the rental', async () => {
      rental.rentDate = addDays(new Date(), -1);
      await rental.save();

      await callApi();

      const storedRental = await Rental.findById(rental._id);

      expect(storedRental).toHaveProperty('rentalFee');
      expect(storedRental.rentalFee).toEqual(rental.movie.dailyRentalRate);
    });

    it('should increase the returned movie stock', async () => {
      await callApi();

      const storedMovie = await Movie.findById(movieId);

      expect(storedMovie.numberInStock).toBe(movie.numberInStock + 1);
    });

    it('should return the rental', async () => {
      const response = await callApi();

      expect(Object.keys(response.body)).toEqual(
        expect.arrayContaining([
          '_id',
          'rentDate',
          'returnDate',
          'rentalFee',
          'movie',
          'customer',
        ])
      );
    });
  });
});
