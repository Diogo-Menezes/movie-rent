const { User } = require('../../../models/user');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

describe('', () => {
  it('', () => {
    const _id = new mongoose.Types.ObjectId().toHexString();
    const payload = { _id, isAdmin: false };
    const user = new User(payload);
    const token = user.generateAuthToken();

    const decoded = jwt.verify(token, process.env.JWT_KEY);

    expect(decoded).toMatchObject(payload);
  });
});
