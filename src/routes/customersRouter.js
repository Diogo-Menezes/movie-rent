const { Router } = require('express');
const { Customer, validateCustomer } = require('../models/customer');

const customerRouter = Router();

customerRouter.get('/', async (req, res) => {
  const customers = await Customer.find().sort('name');

  res.send(customers);
});
customerRouter.get('/:id', async (req, res) => {
  const customer = Customer.findById(req.params.id);

  if (!customer) return res.status(404).send('Invalid customer id');

  res.send(customer);
});
customerRouter.post('/', async (req, res) => {
  const { error } = validateCustomer(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  const customer = await new Customer({ ...req.body }).save();

  res.send(customer);
});
customerRouter.put('/:id', async (req, res) => {
  const { error } = validateCustomer(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    { ...req.body },
    { new: true }
  );

  if (!customer) return res.status(404).send('Invalid customer id');

  res.send(customer);
});

customerRouter.delete('/:id', async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id);

  if (!customer) return res.status(404).send('Invalid customer id');

  res.send(customer);
});

module.exports = customerRouter;
