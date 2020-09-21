const app = require('../../../index');
const request = require('supertest');
const mongoose = require('mongoose');

const { Rental } = require('../../../models/rental');
const { Movie } = require('../../../models/movie');
const { Customer } = require('../../../models/customer');
const { User } = require('../../../models/user');

describe('/api/rentals', () => {
  describe('GET /', () => {
    let rentals;

    beforeEach(async () => {
      rentals = await Rental.insertMany([
        {
          customer: {
            _id: mongoose.Types.ObjectId(),
            name: 'John Doe',
            phone: '1234k56789',
          },
          movie: {
            _id: mongoose.Types.ObjectId(),
            title: 'fake-title',
            dailyRentalRate: 3,
          },
        },
        {
          customer: {
            _id: mongoose.Types.ObjectId(),
            name: 'John Doe2',
            phone: '123456789',
          },
          movie: {
            _id: mongoose.Types.ObjectId(),
            title: 'fake-title2',
            dailyRentalRate: 3,
          },
        },
      ]);
    });

    afterEach(async () => {
      await Rental.collection.deleteMany({});
    });

    it('should return an empty array if there are no rentals', async () => {
      await Rental.deleteMany({});
      const response = await request(app).get('/api/rentals');

      expect(response.status).toBe(200);
      expect(response.body.rentals).toEqual([]);
    });

    it('should return a list of rentals', async () => {
      const response = await request(app).get('/api/rentals');

      expect(response.status).toBe(200);
      expect(response.body.rentals.length).toBe(2);
    });
  });

  describe('GET /:id', () => {
    let rentalId;
    let rentals;

    beforeEach(async () => {
      rentals = await Rental.collection.insertOne({
        customer: {
          _id: mongoose.Types.ObjectId(),
          name: 'John Doe',
          phone: '123456789',
        },
        movie: {
          _id: mongoose.Types.ObjectId(),
          title: 'fake-title',
          dailyRentalRate: 3,
        },
      });

      rentalId = rentals.insertedId;
    });

    afterEach(async () => {
      await Rental.deleteMany({});
    });

    async function callApi() {
      return await request(app).get('/api/rentals/' + rentalId);
    }

    it('should return 404 if no rental is found matching the passed id ', async () => {
      rentalId = mongoose.Types.ObjectId();

      const response = await callApi();

      expect(response.status).toBe(404);
    });

    it('should return a matching rental', async () => {
      const response = await callApi();

      expect(response.status).toBe(200);

      expect(response.body.rental).toHaveProperty('_id', String(rentalId));
    });
  });
  describe('POST /', () => {
    let customerId;
    let movieId;
    let token;
    let movie;
    let customer;

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

      customer = new Customer({
        _id: customerId,
        name: 'John Doe',
        phone: '123456789',
      });

      await customer.save();
    });

    afterEach(async () => {
      await Movie.deleteMany({});
      await Customer.deleteMany({});
      await Rental.deleteMany({});
    });

    async function callApi() {
      return await request(app)
        .post('/api/rentals')
        .set('x-auth-token', token)
        .send({ customerId, movieId });
    }

    it('should return 400 if invalid customerId', async () => {
      customerId = '';

      const response = await callApi();

      expect(response.status).toBe(400);
    });
    it('should return 400 if invalid movieId', async () => {
      movieId = '';

      const response = await callApi();

      expect(response.status).toBe(400);
    });

    it("should return 404 if customerId doesn't match", async () => {
      customerId = mongoose.Types.ObjectId();

      const response = await callApi();

      expect(response.status).toBe(404);
      expect(response.error.text).toBe('Invalid customer id');
    });
    it("should return 404 if movieId doesn't match", async () => {
      movieId = mongoose.Types.ObjectId();

      const response = await callApi();

      expect(response.status).toBe(404);
      expect(response.error.text).toBe('Invalid movie id');
    });

    it('should return 400 if movie is not in stock', async () => {
      const movie = await Movie.findById(movieId);
      movie.numberInStock = 0;
      await movie.save();

      const response = await callApi();

      expect(response.status).toBe(400);
      expect(response.error.text).toBe('Movie not in stock');
    });

    it('should decrease the movie stock', async () => {
      await callApi();

      const storedMovie = await Movie.findById(movieId);

      expect(storedMovie.numberInStock).toBe(movie.numberInStock - 1);
    });
    it('should return a valid rental object', async () => {
      const response = await callApi();

      expect(response.status).toBe(200);
      expect(response.body.rental).toHaveProperty('_id');
      expect(response.body.rental).toHaveProperty(
        'customer._id',
        String(customerId)
      );
      expect(response.body.rental).toHaveProperty('movie._id', String(movieId));
    });
  });
});
