const mongoose = require('mongoose');
const request = require('supertest');
const { Genre } = require('../../../models/genres');
const { User } = require('../../../models/user');
const app = require('../../../index');

describe('/api/genres', () => {
  beforeEach(async () => {
    await Genre.collection.deleteMany({});
  });

  afterEach(async () => {
    await Genre.collection.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  describe('GET /', () => {
    beforeEach(async () => {
      await Genre.collection.deleteMany({});
    });

    afterEach(async () => {
      await Genre.collection.deleteMany({});
    });
    it('should return all genres', async () => {
      await Genre.insertMany([{ name: 'genre1' }, { name: 'genre2' }]);

      const res = await request(app).get('/api/genres');

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some(g => g.name === 'genre1')).toBeTruthy();
      expect(res.body.some(g => g.name === 'genre2')).toBeTruthy();
    });

    it('should return all genres', async () => {
      const res = await request(app).get('/api/genres');
      expect(res.status).toBe(200);
    });
  });

  describe('GET /:id', () => {
    it('should return a genre for a valid id', async () => {
      const genre = await new Genre({ name: 'genre1' }).save();

      const response = await request(app).get(`/api/genres/${genre._id}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('name', genre.name);
      expect(response.body).toHaveProperty('_id', String(genre._id));
    });

    it('should return 404 when a invalid id is sent', async () => {
      const response = await request(app).get(
        `/api/genres/${mongoose.Types.ObjectId().toHexString()}`
      );

      expect(response.status).toBe(404);
    });
  });

  describe('POST /', () => {
    let token = '';

    let name = '';

    beforeEach(() => {
      token = new User().generateAuthToken();
      name = 'genre1';
    });

    const callApi = async () => {
      return await request(app)
        .post('/api/genres')
        .set('x-auth-token', token)
        .send({ name });
    };

    it('should return 401 if client is not logged in', async () => {
      token = '';

      const response = await callApi();

      expect(response.status).toBe(401);
    });

    it('should return 400 if genre name is less than 5 chars', async () => {
      name = '1234';

      const response = await callApi();

      expect(response.status).toBe(400);
    });

    it('should return 400 if genre name is more than 50 chars', async () => {
      name = new Array(52).join('1');

      const response = await callApi();

      expect(response.status).toBe(400);
    });

    it('should save a new genre to the database', async () => {
      await callApi();

      const savedGenre = await Genre.find({ name });

      expect(savedGenre).not.toBeNull();
    });

    it("should return a genre if it's valid", async () => {
      const response = await callApi();

      expect(response.status).toBe(200);

      expect(response.body).toHaveProperty('_id');
      expect(response.body).toHaveProperty('name', name);
    });
  });

  describe('PUT /:id', () => {
    let token = '';
    let name = '';
    let genre = '';

    beforeEach(async () => {
      genre = await (await Genre.collection.insertOne({ name: 'genre1' }))
        .ops[0];
      token = new User().generateAuthToken();
      name = 'genre1';
    });

    afterEach(async () => {
      await Genre.collection.deleteMany({});
    });

    const callApi = async () => {
      return await request(app)
        .put('/api/genres/' + genre._id)
        .set('x-auth-token', token)
        .send({ name });
    };

    it('should return 400 if the genre name is less than 5', async () => {
      name = '1234';
      const response = await callApi();
      expect(response.status).toBe(400);
    });

    it('should return 400 if genre name is more than 50 chars ', async () => {
      name = new Array(52).join('1');
      const response = await callApi();
      expect(response.status).toBe(400);
    });

    it('should return 404 when a valid id is sent but a genre is not found', async () => {
      genre._id = mongoose.Types.ObjectId().toHexString();

      const response = await callApi();
      expect(response.status).toBe(404);
    });

    it('should return an updated genre', async () => {
      name = 'updated genre';
      const response = await callApi();

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('_id', String(genre._id));
      expect(response.body).toHaveProperty('name', 'updated genre');
    });
  });

  describe('DELETE /:id', () => {
    let token = '';
    let genre = '';
    let user = '';

    beforeEach(async () => {
      genre = await (await Genre.collection.insertOne({ name: 'genre1' }))
        .ops[0];

      user = new User({ _id: mongoose.Types.ObjectId(), isAdmin: true });

      token = new User(user).generateAuthToken();
    });

    afterEach(async () => {
      await Genre.collection.deleteMany({});
    });

    callApi = () =>
      request(app)
        .delete('/api/genres/' + genre._id)
        .set('x-auth-token', token);

    it('should return 403 if user is not an admin', async () => {
      user = new User({ _id: mongoose.Types.ObjectId(), isAdmin: false });
      token = new User(user).generateAuthToken();
      const res = await callApi();
      expect(res.status).toBe(403);
    });

    it('should return 404 if no genre is found', async () => {
      genre._id = mongoose.Types.ObjectId().toHexString();

      const res = await callApi();
      expect(res.status).toBe(404);
    });

    it('should return the deleted genre', async () => {
      const res = await callApi();

      console.log(genre._id);
      expect(res.status).toBe(200);
      expect(res.body._id).toMatch(String(genre._id));
    });
  });
});
