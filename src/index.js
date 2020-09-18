if (process.env.NODE_ENV !== 'production') require('dotenv').config();

const mongoose = require('mongoose');
const express = require('express');

const genresRouter = require('./routes/genresRouter');
const customerRouter = require('./routes/customersRouter');
const moviesRouter = require('./routes/moviesRouter');

mongoose
  .connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log('Connected to mongo db'))
  .catch(error => console.log("Couldn't connect to mongo", error));

const app = express();

app.use(express.json());

app.use('/api/genres', genresRouter);
app.use('/api/customers', customerRouter);
app.use('/api/movies', moviesRouter);

const port = process.env.PORT;

app.listen(port, () => console.log(`Server started in port: ${port} 🚀`));
