const requireAuth = require('../../../middleware/requireAuth');
const request = require('supertest');
const { User } = require('../../../models/user');
const app = require('../../../index');
const mongoose = require('mongoose');
const { Genre } = require('../../../models/genres');

describe('requireAuth', () => {
  let token;

  beforeEach(async () => {
    token = new User().generateAuthToken();
    await Genre.collection.deleteMany({});
  });

  afterEach(async () => {
    await Genre.collection.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  const callApi = () => {
    return request(app)
      .post('/api/genres')
      .set('x-auth-token', token)
      .send({ name: 'genre1' });
  };

  it('should return 401 if no token is provided', async () => {
    token = '';

    const resp = await callApi();

    expect(resp.status).toBe(401);
  });
});
