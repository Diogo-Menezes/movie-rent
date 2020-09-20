const app = require('../index');
const winston = require('winston');

const port = process.env.PORT || 3333;

app.listen(port, () => {
  winston.info(`Server started in port: ${port}  🚀`);
});
