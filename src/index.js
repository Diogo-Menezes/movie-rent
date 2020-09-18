const express = require('express');
const genresRouter = require('./routes/genresRouter');

const app = express();

app.use(express.json());

app.use('/api/genres', genresRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server started in port: ${port} 🚀`));
