const mongoose = require('mongoose');
const Joi = require('joi');
const { differenceInDays } = require('date-fns');

const rentalSchema = new mongoose.Schema({
  customer: {
    type: new mongoose.Schema({
      name: { type: String, required: true, minlength: 5 },
      phone: { type: String, required: true, minlength: 9 },
      isGold: { type: Boolean, default: false },
    }),
    required: true,
  },
  movie: {
    type: new mongoose.Schema({
      title: {
        type: String,
        require: true,
        trim: true,
        minlength: 5,
        maxlength: 255,
      },
      dailyRentalRate: { type: Number, require: true, min: 0 },
    }),
    required: true,
  },
  rentDate: { type: Date, required: true, default: Date.now },
  returnDate: Date,
  rentalFee: { type: Number, min: 0 },
});

rentalSchema.statics.lookup = function (customerId, movieId) {
  return this.findOne({
    'customer._id': customerId,
    'movie._id': movieId,
  });
};

rentalSchema.methods.processReturn = function () {
  this.returnDate = new Date();

  const diff = differenceInDays(this.returnDate, this.rentDate);
  this.rentalFee = diff * this.movie.dailyRentalRate;
};

const Rental = mongoose.model('Rental', rentalSchema);

function validateRental(rental) {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  });
  return schema.validate(rental);
}

module.exports = { Rental, validateRental };
