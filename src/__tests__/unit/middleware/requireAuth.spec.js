const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const requireAuth = require('../../../middleware/requireAuth');
const { User } = require('../../../models/user');

describe('requireAuth', () => {
  it('should populate req.user with the token payload', () => {
    const user = {
      _id: mongoose.Types.ObjectId().toHexString(),
      isAdmin: true,
    };
    const token = new User(user).generateAuthToken();
    const req = { header: jest.fn().mockReturnValue(token) };
    const res = jest.fn();
    const next = jest.fn();

    requireAuth(req, res, next);

    const decoded = jwt.verify(token, process.env.JWT_KEY);

    expect(req).toHaveProperty('user', decoded);
    expect(req.user).toHaveProperty('_id', user._id);
    expect(req.user).toHaveProperty('isAdmin', user.isAdmin);
    expect(next).toHaveBeenCalled();
  });
});
